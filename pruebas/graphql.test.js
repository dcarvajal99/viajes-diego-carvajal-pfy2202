// Casos G (API GraphQL de vuelos y hoteles): el cliente de Apollo de la aplicación contra los
// mismos handlers de MSW que usa el navegador, levantados en Node. Ver pruebas/matriz-de-casos.md.
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { peticionesEnCurso } from '../src/api/actividad.js';
import { crearClienteGraphQL } from '../src/graphql/cliente.js';
import { aErrorApi } from '../src/graphql/errores.js';
import { OPCIONES_DE_VIAJE, RESERVAR } from '../src/graphql/operaciones.js';
import { reiniciarDatos } from '../src/mocks/datos.js';
import { ejecutar } from '../src/mocks/esquema.js';
import { handlers } from '../src/mocks/handlers.js';
import { cambiarRetardoBase, cambiarSimulacion } from '../src/mocks/simulacion.js';

const servidor = setupServer(...handlers);
let cliente;

beforeAll(() => {
    cambiarRetardoBase(0);
    servidor.listen({ onUnhandledRequest: 'error' });
});
beforeEach(() => {
    reiniciarDatos();
    cliente = crearClienteGraphQL(); // Caché vacía en cada prueba
});
afterEach(() => cambiarSimulacion('normal'));
afterAll(() => servidor.close());

const opciones = (destinoId, fetchPolicy = 'cache-first') => cliente.query({ query: OPCIONES_DE_VIAJE, variables: { destinoId }, fetchPolicy });

// Ejecuta la operación y devuelve su error convertido a ErrorApi (o falla si no hay error).
async function errorDe(promesa) {
    try {
        await promesa;
    } catch (error) {
        return aErrorApi(error);
    }
    throw new Error('La operación no falló');
}

describe('API GraphQL de vuelos y hoteles', () => {
    it('G1 una sola consulta trae los vuelos y hoteles del destino, con precio, fechas y disponibilidad', async () => {
        const { data } = await opciones('cusco');
        expect(data.vuelos).toHaveLength(3);
        expect(data.hoteles).toHaveLength(3);
        expect(data.vuelos[0]).toMatchObject({ __typename: 'Vuelo', aerolinea: 'LATAM', precio: 389990, ida: '2026-12-10T06:40', asientosDisponibles: 12 });
        expect(data.hoteles[0]).toMatchObject({ __typename: 'Hotel', nombre: 'Casa Inti', precioNoche: 54990, habitacionesDisponibles: 6 });
    });

    it('G2 el servidor responde solo los campos pedidos', async () => {
        const resultado = await ejecutar('{ vuelos(destinoId: "tokio") { numero precio } }');
        expect(resultado.data.vuelos[0]).toEqual({ numero: 'NH0006', precio: 1899990 });
    });

    it('G3 una consulta mal escrita la rechaza el esquema', async () => {
        const resultado = await ejecutar('{ vuelos(destinoId: "tokio") { piloto } }');
        expect(resultado.errors[0].message).toMatch(/piloto/);
    });

    it('G4 un destino inexistente es un error GraphQL NOT_FOUND', async () => {
        const error = await errorDe(opciones('marte'));
        expect(error).toMatchObject({ tipo: 'no-encontrado' });
        expect(error.message).toMatch(/marte/);
    });

    it('G5 la misma consulta no se repite: la segunda vez responde la caché de Apollo', async () => {
        await opciones('madrid');
        cambiarSimulacion('error'); // Si fuera al servidor, fallaría
        const { data } = await opciones('madrid');
        expect(data.vuelos).toHaveLength(3);
    });

    it('G6 reservar descuenta asientos y habitaciones, y la caché ve la disponibilidad nueva', async () => {
        await opciones('lisboa');
        const { data } = await cliente.mutate({ mutation: RESERVAR, variables: { vueloId: 'v-lisboa-1', hotelId: 'h-lisboa-2', pasajeros: 3 } });
        expect(data.reservar).toMatchObject({ pasajeros: 3, noches: 10, habitaciones: 2, total: 3 * 1199990 + 10 * 2 * 109990 });
        expect(data.reservar.codigo).toMatch(/^RA-\d+$/);
        const desdeCache = cliente.readQuery({ query: OPCIONES_DE_VIAJE, variables: { destinoId: 'lisboa' } });
        expect(desdeCache.vuelos.find((vuelo) => vuelo.id === 'v-lisboa-1').asientosDisponibles).toBe(7);
        expect(desdeCache.hoteles.find((hotel) => hotel.id === 'h-lisboa-2').habitacionesDisponibles).toBe(1);
    });

    it('G7 sin asientos suficientes, la reserva es rechazada y no descuenta nada', async () => {
        const error = await errorDe(cliente.mutate({ mutation: RESERVAR, variables: { vueloId: 'v-madrid-3', hotelId: 'h-madrid-1', pasajeros: 2 } }));
        expect(error).toMatchObject({ tipo: 'sin-disponibilidad' });
        const { data } = await opciones('madrid', 'network-only');
        expect(data.vuelos.find((vuelo) => vuelo.id === 'v-madrid-3').asientosDisponibles).toBe(1);
        expect(data.hoteles.find((hotel) => hotel.id === 'h-madrid-1').habitacionesDisponibles).toBe(6);
    });

    it('G8 un hotel que no recibe huéspedes en las fechas del vuelo es rechazado', async () => {
        const error = await errorDe(cliente.mutate({ mutation: RESERVAR, variables: { vueloId: 'v-cusco-1', hotelId: 'h-cusco-3', pasajeros: 1 } }));
        expect(error).toMatchObject({ tipo: 'sin-disponibilidad' });
        expect(error.message).toMatch(/fechas/);
    });
});

describe('Errores de las peticiones GraphQL', () => {
    it('E8 un error 500 es un error HTTP (ServerError)', async () => {
        cambiarSimulacion('error');
        expect(await errorDe(opciones('tokio'))).toMatchObject({ tipo: 'servidor', estado: 500 });
    });

    it('E9 sin conexión es un error de red, distinto del HTTP', async () => {
        cambiarSimulacion('sin-conexion');
        expect(await errorDe(opciones('tokio'))).toMatchObject({ tipo: 'red', estado: null });
        expect(peticionesEnCurso()).toBe(0);
    });
});

// Casos R (API REST de destinos) y E (errores de red y HTTP): el cliente pedirJSON contra los
// mismos handlers de MSW que usa el navegador, levantados en Node. Ver pruebas/matriz-de-casos.md.
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { peticionesEnCurso } from '../src/api/actividad.js';
import { ErrorApi, esperarServidor, pedirJSON } from '../src/api/cliente.js';
import { handlers } from '../src/mocks/handlers.js';
import { cambiarRetardoBase, cambiarSimulacion } from '../src/mocks/simulacion.js';

const servidor = setupServer(...handlers);

beforeAll(() => {
    cambiarRetardoBase(0); // Las pruebas no esperan los 400 ms de una respuesta normal
    servidor.listen({ onUnhandledRequest: 'error' });
});
afterEach(() => {
    cambiarSimulacion('normal');
    esperarServidor(Promise.resolve());
    servidor.resetHandlers();
});
afterAll(() => servidor.close());

// Ejecuta la petición y devuelve el error que lanza (o falla si no lanza ninguno).
async function errorDe(promesa) {
    try {
        await promesa;
    } catch (error) {
        return error;
    }
    throw new Error('La petición no falló');
}

describe('API REST de destinos', () => {
    it('R1 GET /api/destinos lista los 9 destinos con país, región y actividades populares', async () => {
        const destinos = await pedirJSON('destinos');
        expect(destinos).toHaveLength(9);
        expect(destinos[0]).toEqual({
            id: 'cusco', nombre: 'Cusco', pais: 'Perú', region: 'Sudamérica',
            actividades: ['Machu Picchu', 'Valle Sagrado', 'Mercado de San Pedro', 'Montaña de Colores'],
        });
    });

    it('R2 GET /api/destinos/:id entrega el detalle completo', async () => {
        const destino = await pedirJSON('destinos/lisboa');
        expect(destino).toMatchObject({ nombre: 'Lisboa', pais: 'Portugal', idioma: 'Portugués', moneda: 'Euro (EUR)' });
        expect(destino.descripcion).toBeTruthy();
    });

    it('R3 las consultas esperan a que el servidor simulado esté listo', async () => {
        let marcarListo;
        esperarServidor(new Promise((resolver) => (marcarListo = resolver)));
        let respondio = false;
        const consulta = pedirJSON('destinos').then((datos) => {
            respondio = true;
            return datos;
        });
        await new Promise((resolver) => setTimeout(resolver, 20));
        expect(respondio).toBe(false);
        marcarListo();
        expect(await consulta).toHaveLength(9);
    });

    it('R4 cada petición suma al indicador de actividad al empezar y resta al terminar', async () => {
        const consulta = pedirJSON('destinos');
        await new Promise((resolver) => setTimeout(resolver, 0));
        expect(peticionesEnCurso()).toBe(1);
        await consulta;
        expect(peticionesEnCurso()).toBe(0);
    });
});

describe('Errores de las peticiones REST', () => {
    it('E1 un destino inexistente responde 404 con un mensaje', async () => {
        const error = await errorDe(pedirJSON('destinos/marte'));
        expect(error).toBeInstanceOf(ErrorApi);
        expect(error).toMatchObject({ tipo: 'no-encontrado', estado: 404 });
        expect(error.message).toMatch(/marte/);
    });

    it('E2 con el servidor en error, la petición termina en un error 500', async () => {
        cambiarSimulacion('error');
        expect(await errorDe(pedirJSON('destinos'))).toMatchObject({ tipo: 'servidor', estado: 500 });
    });

    it('E3 sin conexión, el error es de red (distinto de un error HTTP)', async () => {
        cambiarSimulacion('sin-conexion');
        const error = await errorDe(pedirJSON('destinos'));
        expect(error).toMatchObject({ tipo: 'red', estado: null });
    });

    it('E4 si el servidor no responde, el cliente se rinde al tiempo máximo', async () => {
        cambiarSimulacion('sin-respuesta');
        expect(await errorDe(pedirJSON('destinos', { tiempoMaximo: 50 }))).toMatchObject({ tipo: 'tiempo' });
        expect(peticionesEnCurso()).toBe(0);
    });

    it('E5 una respuesta que no es JSON es un error de respuesta', async () => {
        servidor.use(http.get('*/api/destinos', () => new HttpResponse('<html>caído</html>', { headers: { 'Content-Type': 'text/html' } })));
        expect(await errorDe(pedirJSON('destinos'))).toMatchObject({ tipo: 'respuesta' });
    });

    it('E6 cancelar desde afuera no se confunde con un error del servidor', async () => {
        cambiarSimulacion('lento');
        const controlador = new AbortController();
        const promesa = pedirJSON('destinos', { signal: controlador.signal });
        controlador.abort();
        const error = await errorDe(promesa);
        expect(error).not.toBeInstanceOf(ErrorApi);
        expect(error.name).toBe('AbortError');
    });

    it('E7 si el servidor simulado no arranca, la consulta falla como error de red', async () => {
        const fallido = Promise.reject(new Error('Sin Service Worker'));
        fallido.catch(() => {});
        esperarServidor(fallido);
        expect(await errorDe(pedirJSON('destinos'))).toMatchObject({ tipo: 'red' });
    });
});

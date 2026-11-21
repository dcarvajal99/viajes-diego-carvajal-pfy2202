// Handlers de MSW: el backend simulado de Rumbo Austral, con dos APIs.
//
// REST (destinos):
//   GET  /api/destinos          → 200 [{ id, nombre, pais, region, actividades }]
//   GET  /api/destinos/:id      → 200 { ...destino, descripcion, mejorEpoca, idioma, moneda } · 404 si no existe
//
// GraphQL (vuelos, hoteles y reservas), en una sola dirección:
//   POST /graphql               → query OpcionesDeViaje { vuelos, hoteles } · mutation Reservar { reservar }
//
// Las rutas empiezan con * porque el sitio puede vivir en una subcarpeta (GitHub Pages).
import { delay, graphql, http, HttpResponse } from 'msw';
import { DESTINOS } from './datos.js';
import { ejecutar } from './esquema.js';
import { obtenerRetardo, obtenerSimulacion } from './simulacion.js';

const api = graphql.link('*/graphql');

export const handlers = [
    http.get('*/api/destinos', async () => {
        const falla = await simularCondicion();
        if (falla) return falla;
        // El listado lleva lo que muestra cada tarjeta; el detalle completo está en /api/destinos/:id.
        return HttpResponse.json(DESTINOS.map(({ id, nombre, pais, region, actividades }) => ({ id, nombre, pais, region, actividades })));
    }),

    http.get('*/api/destinos/:id', async ({ params }) => {
        const falla = await simularCondicion();
        if (falla) return falla;
        const destino = DESTINOS.find((item) => item.id === params.id);
        if (!destino) return HttpResponse.json({ mensaje: 'No existe el destino «' + params.id + '».' }, { status: 404 });
        return HttpResponse.json(destino);
    }),

    // Cualquier operación GraphQL: el esquema la valida y la resuelve (mocks/esquema.js).
    api.operation(async ({ query, variables }) => {
        const falla = await simularCondicion({ graphql: true });
        if (falla) return falla;
        return HttpResponse.json(await ejecutar(query, variables));
    }),
];

// Espera el tiempo de respuesta y aplica la condición elegida en el panel de pruebas.
// Devuelve la respuesta de falla, o null si la petición debe responderse normalmente.
async function simularCondicion({ graphql: esGraphql = false } = {}) {
    const modo = obtenerSimulacion();
    if (modo === 'sin-respuesta') await delay('infinite');
    await delay(obtenerRetardo());
    if (modo === 'error') {
        // En GraphQL va en texto plano: un cuerpo JSON con `errors` se leería como error de la
        // consulta (así lo indica GraphQL sobre HTTP), y aquí se simula una falla del servidor.
        // Con el encabezado escrito a mano, MSW no lo cambia por el tipo de respuesta GraphQL.
        if (esGraphql) return new HttpResponse('Error interno del servidor.', { status: 500, headers: { 'Content-Type': 'text/plain' } });
        return HttpResponse.json({ mensaje: 'Error interno del servidor.' }, { status: 500 });
    }
    if (modo === 'sin-conexion') return HttpResponse.error();
    return null;
}

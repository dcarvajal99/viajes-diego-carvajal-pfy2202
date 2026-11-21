// Casos N: navegación. Comprueba qué ruta atiende cada dirección usando el mismo árbol de rutas
// de la aplicación (sin dibujar páginas), y que las páginas publicadas coincidan con las rutas
// y con los destinos del servidor simulado. Ver pruebas/matriz-de-casos.md.
import { createRoutesFromElements, matchRoutes } from 'react-router';
import { describe, expect, it } from 'vitest';
import AppRoutes from '../src/rutas/AppRoutes.jsx';
import { DESTINOS_PUBLICADOS, PAGINAS_FIJAS } from '../src/rutas/paginasPublicadas.js';
import { DESTINOS } from '../src/mocks/datos.js';

// AppRoutes devuelve <Routes> con el árbol como hijo; no usa hooks, así que se puede llamar directo.
const RUTAS = createRoutesFromElements(AppRoutes().props.children);

function resolver(direccion) {
    const ultima = matchRoutes(RUTAS, direccion).at(-1);
    return { ruta: ultima.route.index ? '(índice)' : ultima.route.path, parametros: ultima.params };
}

describe('Navegación', () => {
    it('N1 el inicio muestra los destinos y /mi-viaje el viaje en armado', () => {
        expect(resolver('/').ruta).toBe('(índice)');
        expect(resolver('/mi-viaje').ruta).toBe('mi-viaje');
    });

    it('N2 la ruta dinámica entrega el id del destino', () => {
        expect(resolver('/destinos/cusco')).toEqual({ ruta: 'destinos/:id', parametros: { id: 'cusco' } });
    });

    it('N3 las direcciones que no existen caen en la página no encontrada', () => {
        expect(resolver('/vuelos').ruta).toBe('*');
        expect(resolver('/destinos').ruta).toBe('*');
        expect(resolver('/destinos/cusco/extra').ruta).toBe('*');
    });

    it('N4 se publica una página por cada ruta fija y cada destino del servidor simulado', () => {
        PAGINAS_FIJAS.forEach((pagina) => expect(resolver('/' + pagina).ruta).toBe(pagina));
        expect([...DESTINOS_PUBLICADOS].sort()).toEqual(DESTINOS.map((destino) => destino.id).sort());
    });
});

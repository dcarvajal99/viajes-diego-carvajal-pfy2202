// @vitest-environment happy-dom
// Casos C: los estados de una consulta vistos desde un componente (hooks/useConsulta.js).
// Se dibuja un componente de prueba con React (en modo estricto, como la aplicación) y la prueba
// decide cuándo y cómo responde el servidor. Ver pruebas/matriz-de-casos.md.
import { StrictMode, act, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { vaciar } from '../src/api/cache.js';
import { ErrorApi, pedirJSON } from '../src/api/cliente.js';
import { useConsulta } from '../src/hooks/useConsulta.js';

// pedirJSON se reemplaza por una versión manual; ErrorApi sigue siendo la real.
vi.mock('../src/api/cliente.js', async (importarOriginal) => ({ ...(await importarOriginal()), pedirJSON: vi.fn() }));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Peticiones que esperan respuesta, en el orden en que se hicieron.
let pendientes = [];
async function responder(datos) {
    await act(async () => pendientes.shift().resolver(datos));
}
async function fallar(error) {
    await act(async () => pendientes.shift().rechazar(error));
}

// Componente de prueba: no dibuja nada, solo anota lo último que devolvió el hook.
let consultas = {};
function useAnotar(nombre, consulta) {
    useEffect(() => {
        consultas[nombre] = consulta;
    });
}
function Sonda({ clave, nombre = 'a' }) {
    useAnotar(nombre, useConsulta(clave));
    return null;
}

let raiz;
async function dibujar(elemento) {
    await act(async () => raiz.render(<StrictMode>{elemento}</StrictMode>));
}

beforeEach(() => {
    vaciar();
    vi.clearAllMocks();
    pendientes = [];
    pedirJSON.mockImplementation((ruta, { signal }) => new Promise((resolver, rechazar) => {
        pendientes.push({ ruta, resolver, rechazar });
        signal.addEventListener('abort', () => rechazar(new DOMException('Cancelada', 'AbortError')));
    }));
    consultas = {};
    raiz = createRoot(document.createElement('div'));
});
afterEach(async () => {
    await act(async () => raiz.unmount());
    await new Promise((resolver) => setTimeout(resolver, 0)); // Deja correr las cancelaciones
});

describe('Estados de una consulta', () => {
    it('C1 primera consulta: cargando sin datos y luego los datos, con una sola petición', async () => {
        await dibujar(<Sonda clave="destinos" />);
        expect(consultas.a).toMatchObject({ datos: null, cargando: true, error: null });
        expect(pedirJSON).toHaveBeenCalledTimes(1); // Aunque el modo estricto monte dos veces
        await responder(['cusco']);
        expect(consultas.a).toMatchObject({ datos: ['cusco'], cargando: false, error: null, respaldo: false });
    });

    it('C2 error sin datos anteriores: aviso sin respaldo; reintentar vuelve a cargar', async () => {
        await dibujar(<Sonda clave="destinos" />);
        await fallar(new ErrorApi('servidor', 'El servidor respondió con un error (500).', 500));
        expect(consultas.a).toMatchObject({ datos: null, cargando: false, respaldo: false });
        expect(consultas.a.error.tipo).toBe('servidor');

        await act(async () => consultas.a.recargar());
        expect(consultas.a).toMatchObject({ datos: null, cargando: true, error: null });
        await responder(['cusco']);
        expect(consultas.a).toMatchObject({ datos: ['cusco'], cargando: false, error: null });
    });

    it('C3 actualizar: los datos siguen a la vista mientras llegan los nuevos', async () => {
        await dibujar(<Sonda clave="destinos" />);
        await responder(['cusco']);
        await act(async () => consultas.a.recargar());
        expect(consultas.a).toMatchObject({ datos: ['cusco'], cargando: true, error: null });
        await responder(['cusco', 'lima']);
        expect(consultas.a).toMatchObject({ datos: ['cusco', 'lima'], cargando: false });
    });

    it('C4 error al actualizar: el aviso aparece junto a los datos anteriores', async () => {
        await dibujar(<Sonda clave="destinos" />);
        await responder(['cusco']);
        await act(async () => consultas.a.recargar());
        await fallar(new ErrorApi('red', 'No se pudo conectar con el servidor.'));
        expect(consultas.a).toMatchObject({ datos: ['cusco'], cargando: false, respaldo: true });
        expect(consultas.a.error.tipo).toBe('red');
    });

    it('C5 otro componente con la misma consulta usa la respuesta guardada, sin pedirla', async () => {
        await dibujar(<Sonda clave="destinos" />);
        await responder(['cusco']);
        await dibujar(<><Sonda clave="destinos" /><Sonda clave="destinos" nombre="b" /></>);
        expect(consultas.b).toMatchObject({ datos: ['cusco'], cargando: false });
        expect(pedirJSON).toHaveBeenCalledTimes(1);
    });

    it('C6 vaciar la caché con la página abierta: vuelve a pedir y no queda cargando', async () => {
        await dibujar(<Sonda clave="destinos" />);
        await responder(['cusco']);
        await act(async () => vaciar());
        expect(consultas.a).toMatchObject({ datos: null, cargando: true });
        expect(pedirJSON).toHaveBeenCalledTimes(2);
        await responder(['cusco']);
        expect(consultas.a).toMatchObject({ datos: ['cusco'], cargando: false });
    });

    it('C7 dos consultas en una página: tras vaciar la caché y actualizar una, ambas terminan con sus datos', async () => {
        // Dos consultas REST en la misma página: la lista de destinos y el detalle de uno.
        function Pagina() {
            useAnotar('lista', useConsulta('destinos'));
            useAnotar('detalle', useConsulta('destinos/cusco'));
            return null;
        }
        await dibujar(<Pagina />);
        await act(async () => pendientes.splice(0).forEach((pendiente) => pendiente.resolver([pendiente.ruta])));
        await act(async () => vaciar());
        await act(async () => consultas.detalle.recargar());
        // Las dos respuestas llegan juntas.
        await act(async () => pendientes.splice(0).forEach((pendiente) => pendiente.resolver([pendiente.ruta])));
        expect(consultas.lista).toMatchObject({ datos: ['destinos'], cargando: false });
        expect(consultas.detalle).toMatchObject({ datos: ['destinos/cusco'], cargando: false });
    });
});

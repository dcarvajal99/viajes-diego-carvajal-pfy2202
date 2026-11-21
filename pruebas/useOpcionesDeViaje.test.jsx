// @vitest-environment happy-dom
// Casos Q: la consulta GraphQL vista desde un componente (hooks/useOpcionesDeViaje.js), con el
// cliente de Apollo de la aplicación contra los handlers de MSW. Cubre los recorridos que pidió
// la revisión: espera, éxito, fallo y reintento, cambio de destino y salir durante la espera.
import { ApolloProvider } from '@apollo/client/react';
import { setupServer } from 'msw/node';
import { StrictMode, act, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { peticionesEnCurso } from '../src/api/actividad.js';
import { crearClienteGraphQL } from '../src/graphql/cliente.js';
import { useOpcionesDeViaje } from '../src/hooks/useOpcionesDeViaje.js';
import { reiniciarDatos } from '../src/mocks/datos.js';
import { handlers } from '../src/mocks/handlers.js';
import { cambiarRetardoBase, cambiarSimulacion } from '../src/mocks/simulacion.js';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const servidor = setupServer(...handlers);
const esperar = (ms) => act(() => new Promise((resolver) => setTimeout(resolver, ms)));

// Cada estado que devolvió el hook, en orden, para revisar también lo que se vio en el camino.
let estados = [];
function Sonda({ destinoId }) {
    const opciones = useOpcionesDeViaje(destinoId);
    useEffect(() => {
        estados.push({ destinoId, ...opciones, vuelos: opciones.vuelos?.map((vuelo) => vuelo.id) ?? null });
    });
    return null;
}
const ultimo = () => estados.at(-1);

let raiz;
let cliente;
async function dibujar(destinoId) {
    await act(async () => raiz.render(<StrictMode><ApolloProvider client={cliente}><Sonda destinoId={destinoId} /></ApolloProvider></StrictMode>));
}

beforeAll(() => servidor.listen({ onUnhandledRequest: 'error' }));
beforeEach(() => {
    reiniciarDatos();
    cambiarRetardoBase(30);
    estados = [];
    cliente = crearClienteGraphQL();
    raiz = createRoot(document.createElement('div'));
});
afterEach(async () => {
    await act(async () => raiz.unmount());
    cambiarSimulacion('normal');
});
afterAll(() => servidor.close());

describe('Consulta GraphQL desde un componente', () => {
    it('Q1 mientras espera muestra cargando sin datos; al responder, los datos y ya no carga', async () => {
        await dibujar('cusco');
        expect(ultimo()).toMatchObject({ cargando: true, vuelos: null, error: null });
        expect(peticionesEnCurso()).toBe(1);
        await esperar(80);
        expect(ultimo()).toMatchObject({ cargando: false, vuelos: ['v-cusco-1', 'v-cusco-2', 'v-cusco-3'], error: null });
        expect(peticionesEnCurso()).toBe(0);
    });

    it('Q2 una respuesta que llega tarde para el destino anterior no reemplaza al vigente', async () => {
        cambiarRetardoBase(60);
        await dibujar('cusco');
        await esperar(20);
        await dibujar('lisboa'); // Cambia de destino antes de que responda Cusco
        await esperar(150);
        const desdeLisboa = estados.filter((estado) => estado.destinoId === 'lisboa');
        // Nunca se vieron vuelos de Cusco con Lisboa elegido, y el indicador no se apagó antes de tiempo.
        expect(desdeLisboa.every((estado) => !estado.vuelos?.some((id) => id.includes('cusco')))).toBe(true);
        expect(desdeLisboa.every((estado) => estado.cargando || estado.vuelos !== null)).toBe(true);
        expect(ultimo()).toMatchObject({ cargando: false, vuelos: ['v-lisboa-1', 'v-lisboa-2', 'v-lisboa-3'] });
    });

    it('Q3 salir de la vista durante la espera cancela la petición sin dejar errores', async () => {
        cambiarRetardoBase(200);
        await dibujar('tokio');
        expect(peticionesEnCurso()).toBe(1);
        await act(async () => raiz.unmount());
        await esperar(20);
        expect(peticionesEnCurso()).toBe(0);
        expect(estados.every((estado) => estado.error === null)).toBe(true);
        raiz = createRoot(document.createElement('div')); // Para el afterEach
    });

    it('Q4 si el servidor falla avisa el error HTTP; al reintentar con el servidor bien, llegan los datos', async () => {
        cambiarSimulacion('error');
        await dibujar('madrid');
        await esperar(80);
        expect(ultimo()).toMatchObject({ cargando: false, vuelos: null });
        expect(ultimo().error).toMatchObject({ tipo: 'servidor', estado: 500 });
        cambiarSimulacion('normal');
        const antes = estados.length;
        await act(async () => ultimo().recargar()); // act espera a que termine el reintento
        // Primero se vio «cargando» sin el error anterior, y después los datos.
        expect(estados[antes]).toMatchObject({ cargando: true, error: null });
        expect(ultimo()).toMatchObject({ cargando: false, error: null, vuelos: ['v-madrid-1', 'v-madrid-2', 'v-madrid-3'] });
    });

    it('Q5 volver a un destino ya consultado no repite la petición', async () => {
        await dibujar('rapa-nui');
        await esperar(80);
        await dibujar('madrid');
        await esperar(80);
        cambiarSimulacion('error'); // Si fuera al servidor, fallaría
        await dibujar('rapa-nui');
        expect(ultimo()).toMatchObject({ cargando: false, error: null, vuelos: ['v-rapa-nui-1', 'v-rapa-nui-2', 'v-rapa-nui-3'] });
        expect(peticionesEnCurso()).toBe(0);
    });
});

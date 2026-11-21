// Casos V (reglas del viaje) y P (plan en armado): funciones puras de utilidades/viaje.js,
// utilidades/destinos.js y plan/plan.js. Ver pruebas/matriz-de-casos.md.
import { describe, expect, it } from 'vitest';
import { HOTELES, VUELOS } from '../src/mocks/datos.js';
import { PLAN_VACIO, cambiarPasajeros, elegir, leerPlan, planCompleto, quitar } from '../src/plan/plan.js';
import { filtrarPorRegion, regionesDe } from '../src/utilidades/destinos.js';
import { calcularTotal, habitacionesPara, motivoHotel, motivoVuelo, nochesDe } from '../src/utilidades/viaje.js';

const vuelo = (id) => VUELOS.find((item) => item.id === id);
const hotel = (id) => HOTELES.find((item) => item.id === id);

describe('Reglas del viaje', () => {
    it('V1 las noches salen de las fechas de ida y vuelta, y las habitaciones son dobles', () => {
        expect(nochesDe(vuelo('v-cusco-1'))).toBe(6);
        expect([1, 2, 3, 6].map(habitacionesPara)).toEqual([1, 1, 2, 3]);
    });

    it('V2 el total suma los vuelos por pasajero y el hotel por noche y habitación', () => {
        expect(calcularTotal({ vuelo: vuelo('v-cusco-1'), hotel: hotel('h-cusco-2'), pasajeros: 3 }))
            .toEqual({ noches: 6, habitaciones: 2, vuelos: 3 * 389990, alojamiento: 6 * 2 * 89990, total: 3 * 389990 + 6 * 2 * 89990 });
        expect(calcularTotal({ vuelo: vuelo('v-cusco-1'), hotel: null, pasajeros: 1 }).total).toBe(389990);
    });

    it('V3 un vuelo agotado o con pocos asientos explica por qué no se puede elegir', () => {
        expect(motivoVuelo(vuelo('v-buenos-aires-2'), 1)).toBe('Agotado');
        expect(motivoVuelo(vuelo('v-madrid-3'), 2)).toBe('Quedan 1 asientos');
        expect(motivoVuelo(vuelo('v-madrid-3'), 1)).toBeNull();
    });

    it('V4 un hotel sin cupo o fuera de las fechas del vuelo explica por qué', () => {
        expect(motivoHotel(hotel('h-buenos-aires-3'), null, 2)).toBe('Sin habitaciones');
        expect(motivoHotel(hotel('h-rapa-nui-3'), null, 3)).toBe('Quedan 1 habitación');
        expect(motivoHotel(hotel('h-cusco-3'), vuelo('v-cusco-1'), 2)).toBe('No disponible en tus fechas');
        expect(motivoHotel(hotel('h-cusco-3'), vuelo('v-cusco-2'), 2)).toBeNull();
    });

    it('V5 las regiones del filtro salen de la respuesta, con su cantidad, y filtrar no modifica la lista', () => {
        const destinos = [{ id: 'a', region: 'Europa' }, { id: 'b', region: 'Asia' }, { id: 'c', region: 'Europa' }];
        const copia = structuredClone(destinos);
        expect(regionesDe(destinos)).toEqual([{ id: 'Europa', nombre: 'Europa', cantidad: 2 }, { id: 'Asia', nombre: 'Asia', cantidad: 1 }]);
        expect(filtrarPorRegion(destinos, 'Europa').map((destino) => destino.id)).toEqual(['a', 'c']);
        expect(filtrarPorRegion(destinos, 'todas')).toBe(destinos);
        expect(destinos).toEqual(copia);
    });
});

describe('Plan del viaje', () => {
    it('P1 elegir un vuelo y un hotel del mismo destino completa el plan', () => {
        const { plan } = elegir(elegir(PLAN_VACIO, 'vueloId', 'cusco', 'v-cusco-1').plan, 'hotelId', 'cusco', 'h-cusco-2');
        expect(plan).toEqual({ destinoId: 'cusco', vueloId: 'v-cusco-1', hotelId: 'h-cusco-2', pasajeros: 2 });
        expect(planCompleto(plan)).toBe(true);
    });

    it('P2 elegir en otro destino reemplaza el plan, conserva los pasajeros y lo avisa', () => {
        const anterior = { destinoId: 'cusco', vueloId: 'v-cusco-1', hotelId: 'h-cusco-2', pasajeros: 4 };
        expect(elegir(anterior, 'hotelId', 'lisboa', 'h-lisboa-1'))
            .toEqual({ plan: { destinoId: 'lisboa', vueloId: null, hotelId: 'h-lisboa-1', pasajeros: 4 }, reemplazado: 'cusco' });
    });

    it('P3 quitar la última opción deja el plan sin destino', () => {
        const soloVuelo = { destinoId: 'cusco', vueloId: 'v-cusco-1', hotelId: null, pasajeros: 3 };
        expect(quitar(soloVuelo, 'vueloId')).toEqual({ ...PLAN_VACIO, pasajeros: 3 });
    });

    it('P4 los pasajeros quedan entre 1 y 6', () => {
        expect(cambiarPasajeros({ ...PLAN_VACIO, pasajeros: 1 }, -1).pasajeros).toBe(1);
        expect(cambiarPasajeros({ ...PLAN_VACIO, pasajeros: 6 }, 1).pasajeros).toBe(6);
        expect(cambiarPasajeros(PLAN_VACIO, 1).pasajeros).toBe(3);
    });

    it('P5 lo guardado se revisa: un plan válido se recupera y uno dañado se descarta', () => {
        const valido = { destinoId: 'cusco', vueloId: 'v-cusco-1', hotelId: null, pasajeros: 2 };
        expect(leerPlan(JSON.stringify(valido))).toEqual(valido);
        expect(leerPlan('{no es json')).toEqual(PLAN_VACIO);
        expect(leerPlan(JSON.stringify({ ...valido, pasajeros: 40 }))).toEqual(PLAN_VACIO);
        expect(leerPlan(JSON.stringify({ ...valido, destinoId: null }))).toEqual(PLAN_VACIO);
    });
});

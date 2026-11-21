// Casos O: optimización de las consultas (src/api/cache.js). Ver pruebas/matriz-de-casos.md.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    VIGENCIA, leerUltimo, leerVigente, pedirCompartido, suscribir, vaciar, vencer,
} from '../src/api/cache.js';

// Una carga controlable desde la prueba: resolver(datos) entrega la respuesta.
function cargaManual() {
    const control = {};
    control.cargar = vi.fn((signal) => {
        control.signal = signal;
        return new Promise((resolver, rechazar) => {
            control.resolver = resolver;
            signal.addEventListener('abort', () => rechazar(new DOMException('Cancelada', 'AbortError')));
        });
    });
    return control;
}

// Cada prueba pide por medio de pedir(): al terminar se sueltan todas sus peticiones, para que
// una petición pendiente no se cuele en la prueba siguiente.
let pendientes = [];
function pedir(clave, cargar) {
    const pedido = pedirCompartido(clave, cargar);
    pedido.promesa.catch(() => {}); // Las canceladas a propósito no cuentan como error sin atender
    pendientes.push(pedido.soltar);
    return pedido;
}

// La cancelación espera un instante (setTimeout 0) por si la misma clave se vuelve a pedir.
const instante = () => new Promise((resolver) => setTimeout(resolver, 0));

beforeEach(() => vaciar());
afterEach(async () => {
    pendientes.forEach((soltar) => soltar());
    pendientes = [];
    await instante();
});

describe('Caché de consultas', () => {
    it('O1 una respuesta se usa sin volver a pedirla mientras está vigente', async () => {
        const carga = cargaManual();
        const { promesa } = pedir('destinos', carga.cargar);
        carga.resolver(['cusco']);
        await promesa;
        const ahora = Date.now();
        expect(leerVigente('destinos', VIGENCIA, ahora)).toEqual(['cusco']);
        expect(leerVigente('destinos', VIGENCIA, ahora + VIGENCIA + 1)).toBeUndefined();
    });

    it('O2 dos componentes que piden lo mismo a la vez comparten una sola petición', async () => {
        const carga = cargaManual();
        const primero = pedir('destinos/cusco', carga.cargar);
        const segundo = pedir('destinos/cusco', carga.cargar);
        expect(carga.cargar).toHaveBeenCalledTimes(1);
        carga.resolver({ nombre: 'Cusco' });
        expect(await primero.promesa).toEqual(await segundo.promesa);
    });

    it('O3 si todos dejan de necesitar la respuesta, la petición se cancela', async () => {
        const carga = cargaManual();
        const { promesa, soltar } = pedir('destinos', carga.cargar);
        soltar();
        await instante();
        expect(carga.signal.aborted).toBe(true);
        await expect(promesa).rejects.toMatchObject({ name: 'AbortError' });
        // Una consulta nueva después de cancelar hace una petición nueva.
        const otra = cargaManual();
        pedir('destinos', otra.cargar);
        expect(otra.cargar).toHaveBeenCalledTimes(1);
    });

    it('O4 si queda un interesado, la petición sigue', async () => {
        const carga = cargaManual();
        const primero = pedir('destinos', carga.cargar);
        pedir('destinos', carga.cargar);
        primero.soltar();
        await instante();
        expect(carga.signal.aborted).toBe(false);
    });

    it('O5 vencer obliga a consultar de nuevo, pero conserva el respaldo', async () => {
        const carga = cargaManual();
        const { promesa } = pedir('destinos', carga.cargar);
        carga.resolver(['cusco']);
        await promesa;
        vencer('destinos');
        expect(leerVigente('destinos')).toBeUndefined();
        expect(leerUltimo('destinos')).toEqual(['cusco']);
    });

    it('O6 la caché avisa a sus suscriptores al empezar una petición y al guardar la respuesta', async () => {
        const avisos = vi.fn();
        const dejar = suscribir(avisos);
        const carga = cargaManual();
        const { promesa } = pedir('destinos', carga.cargar);
        expect(avisos).toHaveBeenCalledTimes(1);
        carga.resolver([]);
        await promesa;
        expect(avisos).toHaveBeenCalledTimes(2);
        dejar();
    });

    it('O7 soltar y volver a pedir enseguida reutiliza la petición (modo estricto de React)', async () => {
        const carga = cargaManual();
        pedir('destinos', carga.cargar).soltar(); // React monta y desmonta...
        pedir('destinos', carga.cargar); // ...y vuelve a montar en el mismo instante
        await instante();
        expect(carga.cargar).toHaveBeenCalledTimes(1);
        expect(carga.signal.aborted).toBe(false);
    });
});

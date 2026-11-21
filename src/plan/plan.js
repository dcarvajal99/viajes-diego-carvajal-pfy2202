// El viaje que la persona va armando: un destino, un vuelo, un hotel y la cantidad de pasajeros.
// Guarda solo identificadores: los precios y la disponibilidad se leen siempre de la API GraphQL,
// así nunca se muestran datos viejos. Funciones puras: reciben un plan y devuelven uno nuevo.
import { PASAJEROS_MAXIMO, pasajerosValidos } from '../utilidades/viaje.js';

export const PLAN_VACIO = { destinoId: null, vueloId: null, hotelId: null, pasajeros: 2 };

// Elegir un vuelo o un hotel. Si es de otro destino, el plan anterior se reemplaza (conservando
// los pasajeros); `reemplazado` avisa a la página para que lo diga.
export function elegir(plan, campo, destinoId, id) {
    if (plan.destinoId && plan.destinoId !== destinoId) {
        return { plan: { ...PLAN_VACIO, pasajeros: plan.pasajeros, destinoId, [campo]: id }, reemplazado: plan.destinoId };
    }
    return { plan: { ...plan, destinoId, [campo]: id }, reemplazado: null };
}

// Quitar el vuelo o el hotel; sin ninguno de los dos, el plan queda sin destino.
export function quitar(plan, campo) {
    const siguiente = { ...plan, [campo]: null };
    return siguiente.vueloId || siguiente.hotelId ? siguiente : { ...PLAN_VACIO, pasajeros: plan.pasajeros };
}

export function cambiarPasajeros(plan, cambio) {
    const pasajeros = plan.pasajeros + cambio;
    return pasajerosValidos(pasajeros) ? { ...plan, pasajeros } : plan;
}

export const puedeSumarPasajero = (plan) => plan.pasajeros < PASAJEROS_MAXIMO;
export const puedeRestarPasajero = (plan) => plan.pasajeros > 1;
export const planCompleto = (plan) => Boolean(plan.destinoId && plan.vueloId && plan.hotelId);

// Revisa lo guardado en el navegador: si no tiene la forma esperada, se parte de cero.
export function leerPlan(texto) {
    try {
        const plan = JSON.parse(texto);
        const textoONulo = (valor) => valor === null || (typeof valor === 'string' && valor.length > 0);
        const valido = plan && typeof plan === 'object'
            && textoONulo(plan.destinoId) && textoONulo(plan.vueloId) && textoONulo(plan.hotelId)
            && pasajerosValidos(plan.pasajeros)
            && (plan.destinoId !== null || (plan.vueloId === null && plan.hotelId === null));
        return valido ? { destinoId: plan.destinoId, vueloId: plan.vueloId, hotelId: plan.hotelId, pasajeros: plan.pasajeros } : PLAN_VACIO;
    } catch {
        return PLAN_VACIO;
    }
}

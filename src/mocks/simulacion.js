// Condición del servidor simulado. El panel de pruebas del pie de página la cambia y los
// handlers la leen antes de responder, así se puede ver cómo reacciona la interfaz ante
// una red lenta, un error 500, una caída de la conexión o un servidor que no responde.
// Se recuerda en sessionStorage: sobrevive a una recarga, pero no a cerrar la pestaña.

export const MODOS = [
    { id: 'normal', nombre: 'Normal', detalle: 'Responde en unos 400 ms.' },
    { id: 'lento', nombre: 'Red lenta', detalle: 'Responde en 3 segundos.' },
    { id: 'error', nombre: 'Error del servidor', detalle: 'Responde 500 a todas las peticiones.' },
    { id: 'sin-conexion', nombre: 'Sin conexión', detalle: 'La petición falla antes de llegar al servidor.' },
    { id: 'sin-respuesta', nombre: 'Sin respuesta', detalle: 'El servidor nunca contesta; el cliente se rinde a los 8 segundos.' },
];

// Milisegundos de espera antes de responder. Las pruebas automáticas usan 0.
export const RETARDOS = { normal: 400, lento: 3000 };

const CLAVE = 'rumbo-austral-simulacion';
const oyentes = new Set();
let modo = leerGuardado();
let retardoBase = RETARDOS.normal;

export function obtenerSimulacion() {
    return modo;
}

export function cambiarSimulacion(nuevo) {
    if (!MODOS.some((item) => item.id === nuevo)) return;
    modo = nuevo;
    try {
        globalThis.sessionStorage?.setItem(CLAVE, nuevo);
    } catch {
        // Almacenamiento bloqueado: el modo dura hasta recargar.
    }
    oyentes.forEach((avisar) => avisar());
}

// Retardo con el modo normal (las pruebas lo dejan en 0 para no esperar).
export function obtenerRetardo() {
    return modo === 'lento' ? RETARDOS.lento : retardoBase;
}

export function cambiarRetardoBase(milisegundos) {
    retardoBase = milisegundos;
}

// Para useSyncExternalStore: avisa a React cada vez que cambia el modo.
export function suscribirSimulacion(avisar) {
    oyentes.add(avisar);
    return () => oyentes.delete(avisar);
}

function leerGuardado() {
    try {
        const guardado = globalThis.sessionStorage?.getItem(CLAVE);
        return MODOS.some((item) => item.id === guardado) ? guardado : 'normal';
    } catch {
        return 'normal';
    }
}

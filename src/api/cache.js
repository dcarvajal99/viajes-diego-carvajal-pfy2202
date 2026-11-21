// Caché de respuestas en memoria, para no repetir consultas:
//   - Cada respuesta se guarda con su hora. Mientras está vigente, se usa sin pedirla de nuevo.
//   - Si dos componentes piden lo mismo al mismo tiempo, comparten una sola petición.
//   - Si todos los interesados se van antes de que llegue la respuesta, la petición se cancela.
//   - Una respuesta vencida no se borra: sirve de respaldo si la siguiente consulta falla.
// Funciona como un store externo a React: avisa a sus suscriptores cada vez que algo cambia
// (llega una respuesta, empieza o termina una petición, se vence o se vacía), y los componentes
// lo leen con useSyncExternalStore (hooks/useConsulta.js). Es la caché de la API REST; las
// consultas GraphQL usan la caché de Apollo (graphql/cliente.js).

export const VIGENCIA = 5 * 60 * 1000; // 5 minutos

const respuestas = new Map(); // clave → { datos, hora }
const enCurso = new Map(); // clave → { promesa, controlador, interesados }
const oyentes = new Set();

// Lo guardado para una clave ({ datos, hora }), o undefined. Es el mismo objeto mientras no
// cambie, como pide useSyncExternalStore.
export function leerEntrada(clave) {
    return respuestas.get(clave);
}

// Datos vigentes de una clave, o undefined si no hay o ya vencieron.
export function leerVigente(clave, vigencia = VIGENCIA, ahora = Date.now()) {
    const guardada = respuestas.get(clave);
    return guardada && ahora - guardada.hora < vigencia ? guardada.datos : undefined;
}

// Últimos datos recibidos, aunque estén vencidos (respaldo ante un error).
export function leerUltimo(clave) {
    return respuestas.get(clave)?.datos;
}

// Marca una clave como vencida: la próxima consulta irá al servidor, pero el respaldo se conserva.
export function vencer(clave) {
    const guardada = respuestas.get(clave);
    if (!guardada) return;
    respuestas.set(clave, { ...guardada, hora: 0 });
    avisar();
}

// Olvida todas las respuestas (botón «Vaciar caché» del panel de pruebas).
export function vaciar() {
    respuestas.clear();
    avisar();
}

// Pide una clave, compartiendo la petición si ya hay una en curso. Devuelve la promesa y una
// función soltar(): quien deja de necesitar la respuesta la llama; si era el último
// interesado y la respuesta no ha llegado, la petición se cancela. La cancelación espera un
// instante: si la misma clave se vuelve a pedir enseguida (React en modo estricto monta,
// desmonta y vuelve a montar cada componente en desarrollo), se reutiliza la petición.
export function pedirCompartido(clave, cargar) {
    let pedido = enCurso.get(clave);
    if (!pedido) {
        const controlador = new AbortController();
        pedido = { controlador, interesados: 0 };
        pedido.promesa = cargar(controlador.signal)
            .then((datos) => {
                respuestas.set(clave, { datos, hora: Date.now() });
                return datos;
            })
            .finally(() => {
                // Llegó la respuesta o el error: la petición termina y se avisa del cambio.
                if (enCurso.get(clave) === pedido) enCurso.delete(clave);
                avisar();
            });
        enCurso.set(clave, pedido);
        avisar();
    }

    pedido.interesados += 1;
    let soltado = false;
    function soltar() {
        if (soltado) return;
        soltado = true;
        pedido.interesados -= 1;
        if (pedido.interesados > 0) return;
        setTimeout(() => {
            if (pedido.interesados === 0 && enCurso.get(clave) === pedido) {
                terminar(clave);
                pedido.controlador.abort();
            }
        }, 0);
    }
    return { promesa: pedido.promesa, soltar };
}

// Para useSyncExternalStore: registra una función que se llama con cada cambio.
export function suscribir(oyente) {
    oyentes.add(oyente);
    return () => oyentes.delete(oyente);
}

function terminar(clave) {
    enCurso.delete(clave);
    avisar();
}

function avisar() {
    oyentes.forEach((funcion) => funcion());
}

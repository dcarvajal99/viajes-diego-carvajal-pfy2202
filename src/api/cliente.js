// Cliente HTTP de la aplicación. `pedir` es la única función que llama a fetch, tanto para la API
// REST como para la GraphQL (Apollo la usa como su fetch): espera a que el servidor simulado
// esté listo, corta la petición si tarda demasiado, cuenta las peticiones en curso y convierte
// las fallas de red en un ErrorApi con un tipo, para que la interfaz explique qué pasó.
import { comenzarPeticion, terminarPeticion } from './actividad.js';

export const TIEMPO_MAXIMO = 8000;

// Tipos de error que distingue la interfaz (componentes/MensajeError.jsx).
export class ErrorApi extends Error {
    constructor(tipo, mensaje, estado = null) {
        super(mensaje);
        this.name = 'ErrorApi';
        // 'red' | 'tiempo' | 'no-encontrado' | 'servidor' | 'respuesta' | 'sin-disponibilidad' | 'consulta'
        this.tipo = tipo;
        this.estado = estado; // Código HTTP, si hubo respuesta
    }
}

// Las consultas esperan a que el servidor simulado esté listo (main.jsx lo inicia en paralelo,
// así la página se dibuja sin esperarlo). Con un backend real no se llama y no hay espera.
let servidorListo = Promise.resolve();
export function esperarServidor(promesa) {
    servidorListo = promesa;
}

// Las APIs viven junto al sitio: /viajes-diego-carvajal-pfy2202/api/... y .../graphql.
function urlDelSitio(ruta) {
    const base = globalThis.location?.href ?? 'http://localhost/';
    return new URL(import.meta.env.BASE_URL + ruta, base).href;
}
export const urlApi = (ruta) => urlDelSitio('api/' + ruta);
export const urlGraphQL = () => urlDelSitio('graphql');

// fetch con espera al mock, tiempo máximo y errores de red con tipo. Una cancelación pedida
// desde afuera (`signal`) se propaga tal cual (AbortError): no es una falla del servidor.
export async function pedir(url, opciones = {}, tiempoMaximo = TIEMPO_MAXIMO) {
    // La espera al servidor simulado también tiene tiempo máximo: si su Service Worker no termina
    // de instalarse (le ocurre a veces a Firefox al recargar en el primer segundo), la consulta
    // termina en un aviso en vez de quedar cargando para siempre.
    let plazo;
    const vencido = new Promise((_, rechazar) => {
        plazo = setTimeout(() => rechazar(new ErrorApi('tiempo', 'El servidor simulado no terminó de iniciar. Recarga la página.')), tiempoMaximo);
    });
    try {
        await Promise.race([servidorListo, vencido]);
    } catch (error) {
        if (error instanceof ErrorApi) throw error;
        throw new ErrorApi('red', 'No se pudo iniciar el servidor simulado.');
    } finally {
        clearTimeout(plazo);
    }

    const { signal } = opciones;
    const limite = AbortSignal.timeout(tiempoMaximo);
    comenzarPeticion();
    try {
        return await fetch(url, { ...opciones, signal: signal ? AbortSignal.any([signal, limite]) : limite });
    } catch (error) {
        if (signal?.aborted) throw error;
        if (limite.aborted) throw new ErrorApi('tiempo', 'El servidor no respondió en ' + tiempoMaximo / 1000 + ' segundos.');
        throw new ErrorApi('red', 'No se pudo conectar con el servidor.');
    } finally {
        terminarPeticion();
    }
}

// API REST: pide un recurso y devuelve el JSON, o lanza un ErrorApi según el código HTTP.
export async function pedirJSON(ruta, { signal, tiempoMaximo } = {}) {
    const respuesta = await pedir(urlApi(ruta), { signal, headers: { Accept: 'application/json' } }, tiempoMaximo);

    if (!respuesta.ok) {
        const cuerpo = await respuesta.json().catch(() => ({}));
        if (respuesta.status === 404) throw new ErrorApi('no-encontrado', cuerpo.mensaje ?? 'El recurso no existe.', 404);
        if (respuesta.status >= 500) throw new ErrorApi('servidor', 'El servidor respondió con un error (' + respuesta.status + ').', respuesta.status);
        throw new ErrorApi('respuesta', 'El servidor rechazó la petición (' + respuesta.status + ').', respuesta.status);
    }

    try {
        return await respuesta.json();
    } catch {
        throw new ErrorApi('respuesta', 'El servidor envió datos que no se pueden leer.', respuesta.status);
    }
}

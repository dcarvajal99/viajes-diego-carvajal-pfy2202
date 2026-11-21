// Explica un error de la API (REST o GraphQL) con palabras claras y ofrece una salida según el
// tipo: reintentar si el problema puede ser pasajero, u otra salida (por ejemplo, volver a los
// destinos) si reintentar no lo arregla. Distingue la falla de red (sin respuesta del servidor)
// del error HTTP (el servidor respondió con un código de error). Con `respaldo`, avisa que lo
// que se ve son los últimos datos recibidos.
import Boton from './Boton.jsx';

const TEXTOS = {
    red: { titulo: 'Sin conexión con el servidor', detalle: 'Revisa tu conexión a internet y vuelve a intentarlo.' },
    tiempo: { titulo: 'El servidor tarda demasiado', detalle: 'Puede estar ocupado: inténtalo de nuevo en un momento.' },
    servidor: { titulo: 'El servidor tuvo un problema', detalle: 'No es algo que hayas hecho tú. Vuelve a intentarlo en unos segundos.' },
    'no-encontrado': { titulo: 'No encontramos lo que buscas', detalle: 'Puede que el enlace esté mal escrito o que ya no exista.' },
    respuesta: { titulo: 'No pudimos leer la respuesta', detalle: 'Vuelve a intentarlo en un momento.' },
    'sin-disponibilidad': { titulo: 'Ya no queda cupo', detalle: 'Elige otra opción o cambia la cantidad de pasajeros.' },
    consulta: { titulo: 'La consulta no se pudo completar', detalle: 'Vuelve a intentarlo en un momento.' },
};

// Reintentar la misma petición no cambia el resultado en estos casos.
const SIN_REINTENTO = ['no-encontrado', 'sin-disponibilidad'];

// `fuente` dice qué parte de la página falló cuando hay más de una consulta (REST y GraphQL).
function MensajeError({ error, fuente, respaldo = false, onReintentar, children }) {
    const texto = TEXTOS[error.tipo] ?? TEXTOS.respuesta;
    const puedeReintentar = !SIN_REINTENTO.includes(error.tipo) && onReintentar;

    return (
        <div className="mb-4 rounded-lg border border-alerta bg-blanco p-4" role="alert">
            {fuente && <p className="mb-0.5 text-xs font-medium text-suave">{fuente}</p>}
            <p className="font-semibold text-alerta">{texto.titulo}</p>
            <p className="mt-1 text-sm">{error.message} {texto.detalle}</p>
            {respaldo && (
                <p className="mt-1 text-sm text-suave">Mientras tanto, se muestran los últimos datos que se recibieron.</p>
            )}
            {(puedeReintentar || children) && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {puedeReintentar && <Boton tamano="chico" variante="principal" onClick={onReintentar}>Reintentar</Boton>}
                    {children}
                </div>
            )}
        </div>
    );
}

export default MensajeError;

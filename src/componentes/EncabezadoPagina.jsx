// Encabezado común de las páginas: título, texto de introducción y, a la derecha, una
// acción opcional (por ejemplo, «Actualizar»). Con `reservarTexto`, la línea del texto ocupa su
// lugar aunque el texto todavía no llegue, para que la página no se mueva cuando aparece.
import { INTRODUCCION, TITULO_PAGINA } from '../utilidades/estilos.js';

function EncabezadoPagina({ titulo, texto, accion, reservarTexto = false }) {
    return (
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
                <h1 className={TITULO_PAGINA}>{titulo}</h1>
                {(texto || reservarTexto) && <p className={INTRODUCCION}>{texto || '\u00a0'}</p>}
            </div>
            {accion}
        </div>
    );
}

export default EncabezadoPagina;

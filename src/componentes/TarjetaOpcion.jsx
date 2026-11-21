// Tarjeta de una opción de viaje (vuelo u hotel) con su precio y el botón para elegirla. Si no
// se puede elegir, el botón queda deshabilitado (aria-disabled, sin perder el foco) y se explica
// por qué. La elegida se marca con el borde del acento y aria-pressed.
import Boton from './Boton.jsx';

function TarjetaOpcion({ titulo, detalle, precio, notaPrecio, disponibilidad, motivo, elegida, textoBoton, onElegir, onQuitar }) {
    return (
        <article
            className={'flex flex-col gap-3 rounded-lg border bg-blanco p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5 ' + (elegida ? 'border-acento outline outline-1 outline-acento' : 'border-borde')}
        >
            <div className="min-w-0">
                <h3 className="font-semibold">{titulo}</h3>
                <div className="mt-1 space-y-0.5 text-sm">{detalle}</div>
            </div>
            <div className="flex shrink-0 flex-wrap items-end justify-between gap-x-4 gap-y-2 sm:flex-col sm:items-end sm:text-right">
                <div>
                    <p className="text-lg font-semibold tabular-nums">{precio}</p>
                    <p className="text-xs text-suave">{notaPrecio}</p>
                    <p className={'mt-1 text-sm ' + (motivo ? 'font-medium text-alerta' : 'text-suave')}>{motivo ?? disponibilidad}</p>
                </div>
                {elegida ? (
                    <Boton tamano="chico" variante="principal" aria-pressed="true" onClick={onQuitar}>
                        Elegido · quitar
                    </Boton>
                ) : (
                    <Boton tamano="chico" aria-pressed="false" aria-disabled={Boolean(motivo)} onClick={() => !motivo && onElegir()}>
                        {textoBoton}
                    </Boton>
                )}
            </div>
        </article>
    );
}

export default TarjetaOpcion;

// Control − cantidad + para cambiar una cantidad de a una unidad. Lo usa el resumen del viaje
// para la cantidad de pasajeros.
// En el límite los botones quedan con aria-disabled en vez de disabled: así el foco no se pierde.
import Boton from './Boton.jsx';

function SelectorCantidad({ cantidad, nombre, puedeRestar, puedeSumar, onRestar, onSumar }) {
    return (
        <div className="inline-flex items-center gap-1.5" role="group" aria-label={'Cantidad de ' + nombre}>
            <Boton
                tamano="icono"
                aria-label={'Quitar uno: ' + nombre}
                aria-disabled={!puedeRestar}
                onClick={() => puedeRestar && onRestar()}
            >
                −
            </Boton>
            <span className="min-w-10 text-center font-semibold tabular-nums">{cantidad}</span>
            <Boton
                tamano="icono"
                aria-label={'Agregar uno: ' + nombre}
                aria-disabled={!puedeSumar}
                onClick={() => puedeSumar && onSumar()}
            >
                +
            </Boton>
        </div>
    );
}

export default SelectorCantidad;

// Grupo de botones de opción única: el elegido queda relleno y con aria-pressed. Lo usan el
// filtro de regiones de los destinos y el orden de las opciones de viaje. Cada opción puede
// mostrar cuántos elementos tiene.
import Boton from './Boton.jsx';

function GrupoOpciones({ etiqueta, opciones, valor, onElegir }) {
    return (
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label={etiqueta}>
            <span className="mr-1 text-sm text-suave" aria-hidden="true">{etiqueta}:</span>
            {opciones.map((opcion) => {
                const elegida = valor === opcion.id;
                return (
                    <Boton
                        key={opcion.id}
                        tamano="chico"
                        variante={elegida ? 'principal' : 'secundario'}
                        aria-pressed={elegida}
                        onClick={() => onElegir(opcion.id)}
                    >
                        {opcion.nombre}
                        {opcion.cantidad !== undefined && <span className="tabular-nums opacity-75">{opcion.cantidad}</span>}
                    </Boton>
                );
            })}
        </div>
    );
}

export default GrupoOpciones;

// Un vuelo de ida y vuelta (datos de la API GraphQL) con su precio por persona y disponibilidad.
import TarjetaOpcion from './TarjetaOpcion.jsx';
import { contar, formatearDiaYHora, formatearDuracion, formatearPesos } from '../utilidades/formato.js';
import { motivoVuelo, nochesDe } from '../utilidades/viaje.js';

function TarjetaVuelo({ vuelo, pasajeros, elegida, onElegir, onQuitar }) {
    return (
        <TarjetaOpcion
            titulo={vuelo.aerolinea + ' · ' + vuelo.numero}
            detalle={
                <>
                    <p>Ida: {formatearDiaYHora(vuelo.ida)}</p>
                    <p>Vuelta: {formatearDiaYHora(vuelo.vuelta)}</p>
                    <p className="text-suave">
                        Desde {vuelo.origen} · {vuelo.escalas === 0 ? 'Directo' : contar(vuelo.escalas, 'escala', 'escalas')} ·{' '}
                        {formatearDuracion(vuelo.duracion)} por tramo · {contar(nochesDe(vuelo), 'noche', 'noches')}
                    </p>
                </>
            }
            precio={formatearPesos(vuelo.precio)}
            notaPrecio="por persona, ida y vuelta"
            disponibilidad={contar(vuelo.asientosDisponibles, 'asiento libre', 'asientos libres')}
            motivo={elegida ? null : motivoVuelo(vuelo, pasajeros)}
            elegida={elegida}
            textoBoton="Elegir vuelo"
            onElegir={onElegir}
            onQuitar={onQuitar}
        />
    );
}

export default TarjetaVuelo;

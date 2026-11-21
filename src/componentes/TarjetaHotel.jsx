// Un hotel del destino (datos de la API GraphQL): precio por noche, fechas en que recibe
// huéspedes y habitaciones libres. Si ya hay un vuelo elegido, revisa que cubra sus fechas.
import Etiquetas from './Etiquetas.jsx';
import TarjetaOpcion from './TarjetaOpcion.jsx';
import { contar, formatearFecha, formatearPesos } from '../utilidades/formato.js';
import { motivoHotel } from '../utilidades/viaje.js';

function TarjetaHotel({ hotel, vuelo, pasajeros, elegida, onElegir, onQuitar }) {
    return (
        <TarjetaOpcion
            titulo={hotel.nombre}
            detalle={
                <>
                    <p>
                        <span aria-hidden="true">{'★'.repeat(hotel.estrellas)}</span>
                        <span className="sr-only">{hotel.estrellas} estrellas</span> · {hotel.barrio}
                    </p>
                    <p className="text-suave">
                        Recibe huéspedes del {formatearFecha(hotel.disponibleDesde)} al {formatearFecha(hotel.disponibleHasta)}
                    </p>
                    <div className="pt-1.5">
                        <Etiquetas textos={hotel.servicios} nombre={'Servicios de ' + hotel.nombre} />
                    </div>
                </>
            }
            precio={formatearPesos(hotel.precioNoche)}
            notaPrecio="por habitación doble y noche"
            disponibilidad={contar(hotel.habitacionesDisponibles, 'habitación libre', 'habitaciones libres')}
            motivo={elegida ? null : motivoHotel(hotel, vuelo, pasajeros)}
            elegida={elegida}
            textoBoton="Elegir hotel"
            onElegir={onElegir}
            onQuitar={onQuitar}
        />
    );
}

export default TarjetaHotel;

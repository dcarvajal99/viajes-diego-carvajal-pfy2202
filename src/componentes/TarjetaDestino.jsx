// Tarjeta de un destino del listado (datos de GET /api/destinos): lleva a su ruta dinámica
// /destinos/:id, donde se consultan sus vuelos y hoteles.
import { Link } from 'react-router';
import Etiquetas from './Etiquetas.jsx';

function TarjetaDestino({ destino }) {
    return (
        <article className="flex h-full flex-col rounded-lg border border-borde bg-blanco p-5">
            <h2 className="text-lg font-semibold">
                <Link to={'/destinos/' + destino.id} className="text-acento hover:underline">{destino.nombre}</Link>
            </h2>
            <p className="text-sm text-suave">{destino.pais} · {destino.region}</p>
            <div className="mt-3 grow">
                <Etiquetas textos={destino.actividades} nombre={'Actividades populares en ' + destino.nombre} />
            </div>
            <Link
                to={'/destinos/' + destino.id}
                className="mt-4 text-sm font-medium text-tinta underline decoration-borde underline-offset-4 hover:decoration-tinta"
                aria-label={'Ver vuelos y hoteles a ' + destino.nombre}
            >
                Ver vuelos y hoteles
            </Link>
        </article>
    );
}

export default TarjetaDestino;

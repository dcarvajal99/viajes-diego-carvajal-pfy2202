// Inicio: los destinos disponibles, pedidos a la API REST (GET /api/destinos), con su país y sus
// actividades populares. Se filtran por región; la región elegida vive en la URL (?region=),
// así se puede compartir y el botón Atrás vuelve al filtro anterior.
import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import Boton from '../componentes/Boton.jsx';
import BotonActualizar from '../componentes/BotonActualizar.jsx';
import Cargando from '../componentes/Cargando.jsx';
import EncabezadoPagina from '../componentes/EncabezadoPagina.jsx';
import GrupoOpciones from '../componentes/GrupoOpciones.jsx';
import MensajeError from '../componentes/MensajeError.jsx';
import TarjetaDestino from '../componentes/TarjetaDestino.jsx';
import { API } from '../api/destinos.js';
import { useConsulta } from '../hooks/useConsulta.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { filtrarPorRegion, regionesDe } from '../utilidades/destinos.js';
import { LINEA_ESTADO } from '../utilidades/estilos.js';
import { contar } from '../utilidades/formato.js';

function Destinos() {
    useTituloPagina('Destinos');
    const { datos: destinos, cargando, error, respaldo, recargar } = useConsulta(API.destinos());
    const [parametros, setParametros] = useSearchParams();
    const region = parametros.get('region') ?? 'todas';

    // Datos derivados de la respuesta: se recalculan solo si cambian los destinos o la región.
    const regiones = useMemo(() => (destinos ? regionesDe(destinos) : []), [destinos]);
    const visibles = useMemo(() => (destinos ? filtrarPorRegion(destinos, region) : null), [destinos, region]);

    function elegirRegion(id) {
        setParametros(id === 'todas' ? {} : { region: id });
    }

    return (
        <>
            <EncabezadoPagina
                titulo="Elige tu próximo destino"
                texto="Vuelos desde Santiago y hoteles en cada destino, para armar tu viaje completo."
                accion={(destinos || cargando) && <BotonActualizar cargando={cargando} onActualizar={recargar} />}
            />

            {error && <MensajeError error={error} respaldo={respaldo} onReintentar={recargar} />}

            {/* El filtro reserva su alto mientras carga, para que la lista no se mueva al aparecer */}
            <div className="mb-4 min-h-[1.875rem]">
                {destinos && (
                    <GrupoOpciones
                        etiqueta="Región"
                        opciones={[{ id: 'todas', nombre: 'Todas', cantidad: destinos.length }, ...regiones]}
                        valor={region}
                        onElegir={elegirRegion}
                    />
                )}
            </div>

            {/* Renderizado condicional según el estado de la petición */}
            {(destinos || cargando) && (
                <p className={LINEA_ESTADO} role="status">
                    {!visibles ? 'Cargando destinos…' : contar(visibles.length, 'destino', 'destinos') + (region === 'todas' ? '' : ' en ' + region)}
                </p>
            )}
            {!destinos && cargando && <Cargando variante="destino" cantidad={9} />}

            {visibles?.length === 0 && (
                <div className="rounded-lg border border-dashed border-borde bg-blanco px-4 py-8 text-center text-suave">
                    <p className="mb-3">No tenemos destinos en «{region}».</p>
                    <Boton tamano="chico" onClick={() => elegirRegion('todas')}>Ver todos los destinos</Boton>
                </div>
            )}
            {visibles?.length > 0 && (
                <ul className="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-4" aria-label="Destinos">
                    {visibles.map((destino) => (
                        <li key={destino.id}>
                            <TarjetaDestino destino={destino} />
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}

export default Destinos;

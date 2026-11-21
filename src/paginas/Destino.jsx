// Un destino: la ruta dinámica /destinos/:id. Consulta las dos APIs al mismo tiempo:
//   - REST, GET /api/destinos/:id: la ficha del destino (país, actividades, mejor época...).
//     Responde 404 si el destino no existe.
//   - GraphQL, query OpcionesDeViaje: sus vuelos y hoteles con precios, fechas y disponibilidad.
// La persona elige un vuelo y un hotel, y el resumen del costado arma el viaje.
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import Aviso from '../componentes/Aviso.jsx';
import Boton from '../componentes/Boton.jsx';
import BotonActualizar from '../componentes/BotonActualizar.jsx';
import Cargando from '../componentes/Cargando.jsx';
import EncabezadoPagina from '../componentes/EncabezadoPagina.jsx';
import Etiquetas from '../componentes/Etiquetas.jsx';
import GrupoOpciones from '../componentes/GrupoOpciones.jsx';
import MensajeError from '../componentes/MensajeError.jsx';
import ResumenViaje from '../componentes/ResumenViaje.jsx';
import TarjetaHotel from '../componentes/TarjetaHotel.jsx';
import TarjetaVuelo from '../componentes/TarjetaVuelo.jsx';
import { API } from '../api/destinos.js';
import { useConsulta } from '../hooks/useConsulta.js';
import { useOpcionesDeViaje } from '../hooks/useOpcionesDeViaje.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { usePlan } from '../plan/PlanContext.js';
import { planCompleto } from '../plan/plan.js';
import { ENLACE_SIMPLE, LINEA_ESTADO, PANEL, SUBTITULO } from '../utilidades/estilos.js';
import { contar } from '../utilidades/formato.js';

const ORDENES = [
    { id: 'precio', nombre: 'Menor precio' },
    { id: 'fecha', nombre: 'Fecha de salida' },
];

function ordenarVuelos(vuelos, orden) {
    const clave = orden === 'fecha' ? (vuelo) => vuelo.ida : (vuelo) => vuelo.precio;
    return [...vuelos].sort((a, b) => (clave(a) < clave(b) ? -1 : clave(a) > clave(b) ? 1 : 0));
}

function Destino() {
    const { id } = useParams();
    const destino = useConsulta(API.destino(id));
    const opciones = useOpcionesDeViaje(id);
    const { plan, elegirVuelo, elegirHotel, quitarVuelo, quitarHotel } = usePlan();
    const [orden, setOrden] = useState('precio');
    const [aviso, setAviso] = useState('');

    const noExiste = destino.error?.tipo === 'no-encontrado';
    const nombre = destino.datos?.nombre ?? (noExiste ? 'Destino no encontrado' : 'Destino');
    useTituloPagina(nombre);

    // Datos derivados de la respuesta GraphQL: se ordenan sin modificar la lista de Apollo.
    const vuelos = useMemo(() => (opciones.vuelos ? ordenarVuelos(opciones.vuelos, orden) : null), [opciones.vuelos, orden]);
    const hoteles = useMemo(() => (opciones.hoteles ? [...opciones.hoteles].sort((a, b) => a.precioNoche - b.precioNoche) : null), [opciones.hoteles]);

    const esteViaje = plan.destinoId === id;
    const vueloElegido = (esteViaje && opciones.vuelos?.find((vuelo) => vuelo.id === plan.vueloId)) || null;
    const hotelElegido = (esteViaje && opciones.hoteles?.find((hotel) => hotel.id === plan.hotelId)) || null;

    function elegir(tipo, opcion) {
        const reemplazado = tipo === 'vuelo' ? elegirVuelo(id, opcion.id) : elegirHotel(id, opcion.id);
        const texto = tipo === 'vuelo' ? 'Elegiste el vuelo ' + opcion.numero : 'Elegiste ' + opcion.nombre;
        setAviso(texto + (reemplazado ? '. Tu viaje anterior se reemplazó por este.' : '.'));
    }

    return (
        <>
            <nav aria-label="Ruta de navegación">
                <ol className="mb-3 flex flex-wrap gap-x-2 text-sm text-suave">
                    <li><Link to="/" className={ENLACE_SIMPLE}>Destinos</Link></li>
                    <li aria-hidden="true">/</li>
                    <li aria-current="page">{nombre}</li>
                </ol>
            </nav>

            <EncabezadoPagina
                titulo={nombre}
                texto={destino.datos && destino.datos.pais + ' · ' + destino.datos.region}
                reservarTexto={!noExiste}
            />

            {destino.error && (
                <MensajeError error={destino.error} fuente={noExiste ? null : 'Ficha del destino · API REST'} respaldo={destino.respaldo} onReintentar={destino.recargar}>
                    <Boton ruta="/" variante={noExiste ? 'principal' : 'secundario'} tamano="chico">Ver todos los destinos</Boton>
                </MensajeError>
            )}

            {!noExiste && (
                <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
                    <div className="space-y-8">
                        {/* Ficha del destino (REST) */}
                        <section className={PANEL} aria-label={'Sobre ' + nombre}>
                            {destino.datos ? (
                                <>
                                    <p className="mb-4">{destino.datos.descripcion}</p>
                                    <dl className="mb-4 grid gap-3 text-sm sm:grid-cols-3">
                                        {[['Mejor época', destino.datos.mejorEpoca], ['Idioma', destino.datos.idioma], ['Moneda', destino.datos.moneda]].map(([dato, valor]) => (
                                            <div key={dato}>
                                                <dt className="text-[0.8125rem] font-medium text-suave">{dato}</dt>
                                                <dd>{valor}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                    <h2 className="mb-2 text-sm font-medium">Actividades populares</h2>
                                    <Etiquetas textos={destino.datos.actividades} nombre={'Actividades populares en ' + nombre} />
                                </>
                            ) : destino.cargando ? (
                                <>
                                    <p className="sr-only" role="status">Cargando la información del destino…</p>
                                    <Cargando variante="ficha" />
                                </>
                            ) : (
                                <p className="text-sm text-suave">La información del destino no está disponible.</p>
                            )}
                        </section>

                        {/* Vuelos y hoteles (GraphQL) */}
                        <Aviso>{aviso}</Aviso>
                        {opciones.error && (
                            <MensajeError error={opciones.error} fuente="Vuelos y hoteles · API GraphQL" respaldo={opciones.respaldo} onReintentar={opciones.recargar}>
                                <Boton ruta="/" tamano="chico">Ver otros destinos</Boton>
                            </MensajeError>
                        )}

                        <section aria-labelledby="titulo-vuelos">
                            <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
                                <h2 id="titulo-vuelos" className={SUBTITULO}>Vuelos desde Santiago</h2>
                                {(vuelos || opciones.cargando) && <BotonActualizar cargando={opciones.cargando} onActualizar={opciones.recargar} />}
                            </div>
                            {/* El selector reserva su alto mientras cargan los vuelos, para que la lista no se mueva */}
                            {(vuelos?.length > 1 || (!vuelos && opciones.cargando)) && (
                                <div className="mb-3 min-h-[1.875rem]">
                                    {vuelos && <GrupoOpciones etiqueta="Ordenar" opciones={ORDENES} valor={orden} onElegir={setOrden} />}
                                </div>
                            )}
                            {(vuelos || opciones.cargando) && (
                                <p className={LINEA_ESTADO} role="status">{vuelos ? contar(vuelos.length, 'vuelo', 'vuelos') + ' de ida y vuelta' : 'Cargando vuelos…'}</p>
                            )}
                            {!vuelos && opciones.cargando && <Cargando variante="opcion" />}
                            {vuelos && (
                                <ul className="space-y-3" aria-label={'Vuelos a ' + nombre}>
                                    {vuelos.map((vuelo) => (
                                        <li key={vuelo.id}>
                                            <TarjetaVuelo
                                                vuelo={vuelo}
                                                pasajeros={plan.pasajeros}
                                                elegida={vueloElegido?.id === vuelo.id}
                                                onElegir={() => elegir('vuelo', vuelo)}
                                                onQuitar={quitarVuelo}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>

                        <section aria-labelledby="titulo-hoteles">
                            <h2 id="titulo-hoteles" className={SUBTITULO + ' mb-3'}>Hoteles en {destino.datos?.nombre ?? 'el destino'}</h2>
                            {(hoteles || opciones.cargando) && (
                                <p className={LINEA_ESTADO} role="status">
                                    {hoteles ? contar(hoteles.length, 'hotel', 'hoteles') + (vueloElegido ? ', revisados para las fechas de tu vuelo' : '') : 'Cargando hoteles…'}
                                </p>
                            )}
                            {!hoteles && opciones.cargando && <Cargando variante="opcion" />}
                            {hoteles && (
                                <ul className="space-y-3" aria-label={'Hoteles en ' + nombre}>
                                    {hoteles.map((hotel) => (
                                        <li key={hotel.id}>
                                            <TarjetaHotel
                                                hotel={hotel}
                                                vuelo={vueloElegido}
                                                pasajeros={plan.pasajeros}
                                                elegida={hotelElegido?.id === hotel.id}
                                                onElegir={() => elegir('hotel', hotel)}
                                                onQuitar={quitarHotel}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    </div>

                    <aside className="lg:sticky lg:top-4">
                        <ResumenViaje titulo={'Tu viaje a ' + (destino.datos?.nombre ?? 'este destino')} vuelo={vueloElegido} hotel={hotelElegido}>
                            {plan.destinoId && !esteViaje && (
                                <p className="text-sm text-suave">Ya tienes un viaje armado a otro destino. Si eliges aquí, lo reemplazas.</p>
                            )}
                            <Boton ruta="/mi-viaje" variante={esteViaje && planCompleto(plan) ? 'principal' : 'secundario'} className="w-full">
                                {esteViaje && planCompleto(plan) ? 'Revisar y reservar' : 'Ver mi viaje'}
                            </Boton>
                        </ResumenViaje>
                    </aside>
                </div>
            )}
        </>
    );
}

export default Destino;

// Cabecera del sitio: el logotipo lleva a los destinos y el menú, a Mi viaje (con cuántas
// opciones lleva elegidas). Mientras haya peticiones al servidor en curso, REST o GraphQL, una
// barra fina bajo la cabecera y un aviso para el lector de pantalla indican que se consultan datos.
import { Link, NavLink, useMatch } from 'react-router';
import { usePeticionesEnCurso } from '../hooks/useExterno.js';
import { usePlan } from '../plan/PlanContext.js';
import { CONTENEDOR } from '../utilidades/estilos.js';

const claseEnlace = ({ isActive }) =>
    'inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium ' + (isActive ? 'bg-lienzo font-semibold text-acento' : 'text-suave hover:text-tinta');

function Cabecera() {
    const enCurso = usePeticionesEnCurso();
    const { plan } = usePlan();
    const elegidas = Number(Boolean(plan.vueloId)) + Number(Boolean(plan.hotelId));
    // «Destinos» queda marcado también en el detalle de un destino.
    const enUnDestino = useMatch('/destinos/:id');

    return (
        <header className="relative border-b border-borde bg-blanco">
            <div className={CONTENEDOR + ' flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3'}>
                <Link to="/" className="inline-flex items-center gap-2.5 text-lg font-semibold text-tinta">
                    <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
                        <rect className="fill-acento" width="32" height="32" rx="8" />
                        <path className="fill-none stroke-blanco" strokeWidth="1.8" strokeLinejoin="round" d="M8.5 19.5 24 11l-4.6 12.6-3.6-4.9-5.6-.8 13.8-6.8-8.2 7.6" />
                    </svg>
                    <span>Rumbo Austral</span>
                </Link>
                <nav aria-label="Menú principal" className="flex gap-1">
                    <NavLink to="/" end className={({ isActive }) => claseEnlace({ isActive: isActive || Boolean(enUnDestino) })}>Destinos</NavLink>
                    <NavLink to="/mi-viaje" className={claseEnlace}>
                        Mi viaje
                        {elegidas > 0 && (
                            <span className="rounded-full bg-acento px-1.5 text-xs font-semibold text-blanco tabular-nums">
                                {elegidas}<span className="sr-only">{elegidas === 1 ? ' opción elegida' : ' opciones elegidas'}</span>
                            </span>
                        )}
                    </NavLink>
                </nav>
            </div>
            {/* Indicador de actividad: aparece mientras haya al menos una petición en curso */}
            {enCurso > 0 && <div className="absolute inset-x-0 -bottom-px h-0.5 animate-pulse bg-acento" aria-hidden="true" />}
            <p className="sr-only" role="status">{enCurso > 0 ? 'Consultando el servidor…' : ''}</p>
        </header>
    );
}

export default Cabecera;

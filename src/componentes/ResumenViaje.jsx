// Resumen del viaje en armado: pasajeros, vuelo y hotel elegidos y el desglose del precio. Lo
// usan el detalle de un destino (al costado de las opciones) y la página Mi viaje.
import SelectorCantidad from './SelectorCantidad.jsx';
import { usePlan } from '../plan/PlanContext.js';
import { puedeRestarPasajero, puedeSumarPasajero } from '../plan/plan.js';
import { PANEL } from '../utilidades/estilos.js';
import { contar, formatearDiaYHora, formatearPesos } from '../utilidades/formato.js';
import { calcularTotal } from '../utilidades/viaje.js';

function Fila({ etiqueta, valor, fuerte = false }) {
    return (
        <div className={'flex justify-between gap-3 ' + (fuerte ? 'border-t border-borde pt-2 text-base font-semibold' : '')}>
            <dt>{etiqueta}</dt>
            <dd className="tabular-nums">{valor}</dd>
        </div>
    );
}

function ResumenViaje({ titulo, vuelo, hotel, children }) {
    const { plan, cambiarPasajeros } = usePlan();
    const precio = vuelo ? calcularTotal({ vuelo, hotel, pasajeros: plan.pasajeros }) : null;

    return (
        <section className={PANEL + ' space-y-4'} aria-labelledby="titulo-resumen">
            <h2 id="titulo-resumen" className="text-lg font-semibold">{titulo}</h2>

            <div className="flex items-center justify-between gap-3">
                <span id="etiqueta-pasajeros" className="text-sm font-medium">Pasajeros</span>
                <SelectorCantidad
                    cantidad={plan.pasajeros}
                    nombre="pasajeros"
                    puedeRestar={puedeRestarPasajero(plan)}
                    puedeSumar={puedeSumarPasajero(plan)}
                    onRestar={() => cambiarPasajeros(-1)}
                    onSumar={() => cambiarPasajeros(1)}
                />
            </div>

            <div className="space-y-2 text-sm">
                <p>
                    <span className="font-medium">Vuelo: </span>
                    {vuelo ? vuelo.aerolinea + ' ' + vuelo.numero + ', ' + formatearDiaYHora(vuelo.ida) : <span className="text-suave">todavía no eliges uno</span>}
                </p>
                <p>
                    <span className="font-medium">Hotel: </span>
                    {hotel ? hotel.nombre : <span className="text-suave">todavía no eliges uno</span>}
                </p>
            </div>

            {precio && (
                <dl className="space-y-1 text-sm">
                    <Fila etiqueta={'Vuelos (' + contar(plan.pasajeros, 'pasajero', 'pasajeros') + ')'} valor={formatearPesos(precio.vuelos)} />
                    {hotel && (
                        <Fila
                            etiqueta={'Hotel (' + contar(precio.noches, 'noche', 'noches') + ', ' + contar(precio.habitaciones, 'habitación', 'habitaciones') + ')'}
                            valor={formatearPesos(precio.alojamiento)}
                        />
                    )}
                    <Fila etiqueta="Total" valor={formatearPesos(precio.total)} fuerte />
                </dl>
            )}

            {children}
        </section>
    );
}

export default ResumenViaje;

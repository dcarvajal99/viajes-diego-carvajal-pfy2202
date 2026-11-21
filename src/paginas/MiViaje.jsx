// Mi viaje: el resumen del viaje en armado y su confirmación. El plan guarda solo identificadores;
// el nombre del destino viene de la API REST y los datos del vuelo y del hotel, de la API GraphQL
// (normalmente ya están en caché). «Confirmar reserva» envía la mutación GraphQL `reservar`.
import { useMutation } from '@apollo/client/react';
import Boton from '../componentes/Boton.jsx';
import EncabezadoPagina from '../componentes/EncabezadoPagina.jsx';
import MensajeError from '../componentes/MensajeError.jsx';
import ResumenViaje from '../componentes/ResumenViaje.jsx';
import { API } from '../api/destinos.js';
import { aErrorApi } from '../graphql/errores.js';
import { RESERVAR } from '../graphql/operaciones.js';
import { useConsulta } from '../hooks/useConsulta.js';
import { useOpcionesDeViaje } from '../hooks/useOpcionesDeViaje.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { usePlan } from '../plan/PlanContext.js';
import { PANEL } from '../utilidades/estilos.js';
import { contar, formatearDiaYHora, formatearPesos } from '../utilidades/formato.js';

function ReservaConfirmada({ reserva }) {
    return (
        <section className={PANEL + ' max-w-2xl border-acento'} aria-labelledby="titulo-reserva">
            <h2 id="titulo-reserva" className="text-lg font-semibold text-acento">Reserva confirmada</h2>
            <p className="mt-1">
                Código <strong className="tabular-nums">{reserva.codigo}</strong>: viaje a {reserva.destino} para{' '}
                {contar(reserva.pasajeros, 'pasajero', 'pasajeros')}.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
                <li>Vuelo {reserva.vuelo}</li>
                <li>{reserva.hotel}: {contar(reserva.noches, 'noche', 'noches')}, {contar(reserva.habitaciones, 'habitación', 'habitaciones')}</li>
                <li className="font-semibold">Total pagado: {formatearPesos(reserva.total)}</li>
            </ul>
            <div className="mt-4"><Boton ruta="/" tamano="chico">Planear otro viaje</Boton></div>
        </section>
    );
}

function MiViaje() {
    useTituloPagina('Mi viaje');
    const { plan, ultimaReserva, registrarReserva } = usePlan();
    const destino = useConsulta(plan.destinoId ? API.destino(plan.destinoId) : null);
    const opciones = useOpcionesDeViaje(plan.destinoId);
    const [reservar, { loading: confirmando, error: errorReserva, reset }] = useMutation(RESERVAR);

    const vuelo = opciones.vuelos?.find((item) => item.id === plan.vueloId) ?? null;
    const hotel = opciones.hoteles?.find((item) => item.id === plan.hotelId) ?? null;
    const nombreDestino = destino.datos?.nombre ?? 'tu destino';
    const error = aErrorApi(errorReserva);

    async function confirmar() {
        try {
            const { data } = await reservar({ variables: { vueloId: vuelo.id, hotelId: hotel.id, pasajeros: plan.pasajeros } });
            registrarReserva({
                ...data.reservar,
                destino: nombreDestino,
                vuelo: vuelo.aerolinea + ' ' + vuelo.numero + ', ' + formatearDiaYHora(vuelo.ida),
                hotel: hotel.nombre,
            });
            reset();
        } catch {
            // El error queda en el estado de la mutación y se muestra con MensajeError.
        }
    }

    let contenido;
    if (!plan.destinoId) {
        contenido = ultimaReserva ? <ReservaConfirmada reserva={ultimaReserva} /> : (
            <div className="rounded-lg border border-dashed border-borde bg-blanco px-4 py-8 text-center text-suave">
                <p className="mb-3">Todavía no armas un viaje. Elige un destino y luego un vuelo y un hotel.</p>
                <Boton ruta="/" tamano="chico">Ver los destinos</Boton>
            </div>
        );
    } else {
        const falta = !plan.vueloId ? 'un vuelo' : !plan.hotelId ? 'un hotel' : null;
        contenido = (
            <div className="max-w-2xl space-y-4">
                {opciones.error && <MensajeError error={opciones.error} fuente="Vuelos y hoteles · API GraphQL" respaldo={opciones.respaldo} onReintentar={opciones.recargar} />}
                {error && (
                    <MensajeError error={error} fuente="Reserva · API GraphQL" onReintentar={confirmar}>
                        <Boton ruta={'/destinos/' + plan.destinoId} tamano="chico">Cambiar vuelo u hotel</Boton>
                    </MensajeError>
                )}
                {opciones.cargando && !opciones.vuelos && <p className="text-sm text-suave" role="status">Cargando los datos de tu viaje…</p>}
                <ResumenViaje titulo={'Tu viaje a ' + nombreDestino} vuelo={vuelo} hotel={hotel}>
                    <div className="flex flex-wrap gap-2">
                        {falta ? (
                            <Boton ruta={'/destinos/' + plan.destinoId} variante="principal">Elegir {falta}</Boton>
                        ) : (
                            <Boton variante="principal" aria-disabled={confirmando || !vuelo || !hotel} onClick={() => !confirmando && vuelo && hotel && confirmar()}>
                                {confirmando ? 'Confirmando…' : 'Confirmar reserva'}
                            </Boton>
                        )}
                        <Boton ruta={'/destinos/' + plan.destinoId}>Volver a {nombreDestino}</Boton>
                    </div>
                </ResumenViaje>
                <p className="text-sm text-suave" role="status">{confirmando ? 'Enviando la reserva al servidor…' : ''}</p>
            </div>
        );
    }

    return (
        <>
            <EncabezadoPagina titulo="Mi viaje" texto="Revisa lo que elegiste y confirma la reserva." />
            {contenido}
        </>
    );
}

export default MiViaje;

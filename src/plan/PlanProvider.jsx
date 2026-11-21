// Estado global del viaje con useState. useEffect lo guarda en el navegador cada vez que cambia,
// así el viaje sobrevive a una recarga. Las transiciones son funciones puras (plan/plan.js).
import { useEffect, useState } from 'react';
import { PlanContext } from './PlanContext.js';
import { PLAN_VACIO, cambiarPasajeros, elegir, leerPlan, quitar } from './plan.js';

const CLAVE = 'rumbo-austral-viaje';

function leerGuardado() {
    try {
        const texto = globalThis.localStorage?.getItem(CLAVE);
        return texto ? leerPlan(texto) : PLAN_VACIO;
    } catch {
        return PLAN_VACIO;
    }
}

function PlanProvider({ children }) {
    const [plan, setPlan] = useState(leerGuardado);
    const [ultimaReserva, setUltimaReserva] = useState(null);

    useEffect(() => {
        try {
            if (plan.destinoId) localStorage.setItem(CLAVE, JSON.stringify(plan));
            else localStorage.removeItem(CLAVE);
        } catch {
            // Almacenamiento bloqueado: el viaje dura hasta cerrar la pestaña.
        }
    }, [plan]);

    // Devuelve el destino que se reemplazó, si el vuelo u hotel era de otro destino.
    function elegirOpcion(campo, destinoId, id) {
        const resultado = elegir(plan, campo, destinoId, id);
        setPlan(resultado.plan);
        setUltimaReserva(null);
        return resultado.reemplazado;
    }

    const valor = {
        plan,
        ultimaReserva,
        elegirVuelo: (destinoId, vueloId) => elegirOpcion('vueloId', destinoId, vueloId),
        elegirHotel: (destinoId, hotelId) => elegirOpcion('hotelId', destinoId, hotelId),
        quitarVuelo: () => setPlan((actual) => quitar(actual, 'vueloId')),
        quitarHotel: () => setPlan((actual) => quitar(actual, 'hotelId')),
        cambiarPasajeros: (cambio) => setPlan((actual) => cambiarPasajeros(actual, cambio)),
        // Una reserva confirmada vacía el plan y queda a la vista hasta armar otro viaje.
        registrarReserva: (reserva) => {
            setUltimaReserva(reserva);
            setPlan((actual) => ({ ...PLAN_VACIO, pasajeros: actual.pasajeros }));
        },
    };

    return <PlanContext.Provider value={valor}>{children}</PlanContext.Provider>;
}

export default PlanProvider;

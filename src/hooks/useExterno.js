// Hooks que conectan a React con dos estados que viven fuera de los componentes:
// la condición del servidor simulado y la cantidad de peticiones en curso. Usan
// useSyncExternalStore, que vuelve a dibujar el componente cuando ese estado cambia.
import { useSyncExternalStore } from 'react';
import { peticionesEnCurso, suscribirActividad } from '../api/actividad.js';
import { obtenerSimulacion, suscribirSimulacion } from '../mocks/simulacion.js';

export function useSimulacion() {
    return useSyncExternalStore(suscribirSimulacion, obtenerSimulacion);
}

export function usePeticionesEnCurso() {
    return useSyncExternalStore(suscribirActividad, peticionesEnCurso);
}

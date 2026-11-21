// Contexto del viaje en armado. Cualquier página lo lee con usePlan().
import { createContext, useContext } from 'react';

export const PlanContext = createContext(null);

export function usePlan() {
    const valor = useContext(PlanContext);
    if (!valor) throw new Error('usePlan() debe usarse dentro de <PlanProvider>');
    return valor;
}

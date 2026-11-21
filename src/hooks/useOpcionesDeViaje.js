// Vuelos y hoteles de un destino desde la API GraphQL, con useQuery de Apollo. Devuelve la misma
// forma que useConsulta (REST), así las páginas tratan igual la carga y los errores:
//   { vuelos, hoteles, cargando, error, respaldo, recargar }
// - Apollo pide recién cuando un componente necesita el destino, guarda la respuesta en su caché
//   y no repite la consulta al volver a la página.
// - Si cambia el destino, solo se muestran los datos del destino vigente: una respuesta que llega
//   tarde para el destino anterior queda en la caché, pero no reemplaza lo que se ve.
// - Si el componente se va antes de la respuesta, Apollo cancela la petición.
import { useQuery } from '@apollo/client/react';
import { aErrorApi } from '../graphql/errores.js';
import { OPCIONES_DE_VIAJE } from '../graphql/operaciones.js';

export function useOpcionesDeViaje(destinoId) {
    const { data, loading, error, refetch } = useQuery(OPCIONES_DE_VIAJE, { variables: { destinoId }, skip: !destinoId });
    const errorApi = aErrorApi(error);
    return {
        vuelos: data?.vuelos ?? null,
        hoteles: data?.hoteles ?? null,
        cargando: loading,
        error: errorApi,
        respaldo: Boolean(errorApi && data),
        // Vuelve a pedir al servidor; el error, si lo hay, ya queda en `error`.
        recargar: () => refetch().catch(() => {}),
    };
}

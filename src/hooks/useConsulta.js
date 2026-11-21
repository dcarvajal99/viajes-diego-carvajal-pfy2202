// Hook para consultar una ruta de la API REST desde un componente (useConsulta('destinos')).
// Con `null` no consulta nada (por ejemplo, Mi viaje sin destino elegido).
// La ruta es también la clave de la caché. Devuelve el estado de la petición:
//   { datos, cargando, error, respaldo, recargar }
// - Los datos salen siempre de la caché (api/cache.js), a la que el componente se suscribe con
//   useSyncExternalStore: cuando llega una respuesta, o la caché se vence o se vacía, el
//   componente se vuelve a dibujar con lo que hay guardado.
// - Si la caché no tiene la respuesta vigente, el efecto la pide al servidor (compartiendo la
//   petición si otro componente ya la hizo) y la cancela si el componente se va antes.
// - El estado propio guarda solo lo que la caché no sabe: el error del intento actual.
// - Si la consulta falla y hay datos anteriores, se entregan con respaldo: true, para que la
//   página siga mostrando algo útil junto al aviso del error.
// - recargar() vence la respuesta guardada y vuelve a pedirla; mientras llega, los datos que
//   ya se veían siguen en pantalla.
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { leerEntrada, leerVigente, pedirCompartido, suscribir, vencer } from '../api/cache.js';
import { pedirJSON } from '../api/cliente.js';

export function useConsulta(clave) {
    const entrada = useSyncExternalStore(suscribir, () => (clave ? leerEntrada(clave) : undefined));
    const [intento, setIntento] = useState(0);
    const [fallo, setFallo] = useState(null); // { clave, intento, error }

    const vigente = clave === null || leerVigente(clave) !== undefined;

    // Se pide al servidor cuando la caché no tiene la respuesta vigente: la primera vez, al
    // cambiar de ruta, al recargar, o si la respuesta venció o se vació la caché.
    useEffect(() => {
        if (vigente) return;
        let activa = true;
        const { promesa, soltar } = pedirCompartido(clave, (signal) => pedirJSON(clave, { signal }));
        // Si sale bien no hay nada que hacer aquí: la caché guarda la respuesta y avisa.
        promesa.catch((error) => {
            if (activa && error.name !== 'AbortError') setFallo({ clave, intento, error });
        });
        return () => {
            activa = false;
            soltar();
            setFallo(null); // El error pertenece a este intento: al cambiar de ruta o reintentar, se olvida
        };
    }, [clave, intento, vigente]);

    const recargar = useCallback(() => {
        vencer(clave);
        setIntento((numero) => numero + 1);
    }, [clave]);

    const error = !vigente && fallo?.clave === clave && fallo.intento === intento ? fallo.error : null;
    const datos = entrada?.datos ?? null;
    return { datos, cargando: !vigente && !error, error, respaldo: error !== null && datos !== null, recargar };
}

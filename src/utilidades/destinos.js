// Funciones sin estado sobre la lista de destinos que entrega la API REST.

// Regiones presentes en la respuesta, en el orden en que aparecen, con cuántos destinos tiene cada
// una. El filtro se arma con esto, no con una lista fija: si el servicio suma una región, aparece.
export function regionesDe(destinos) {
    const conteo = new Map();
    destinos.forEach((destino) => conteo.set(destino.region, (conteo.get(destino.region) ?? 0) + 1));
    return [...conteo].map(([region, cantidad]) => ({ id: region, nombre: region, cantidad }));
}

// Destinos de una región ('todas' para no filtrar). Devuelve un arreglo nuevo: la lista original
// que entregó el servicio no se modifica.
export function filtrarPorRegion(destinos, region) {
    return region === 'todas' ? destinos : destinos.filter((destino) => destino.region === region);
}

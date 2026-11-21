// Rutas de la API REST de destinos. Las páginas las pasan a useConsulta(), que decide si hace
// falta pedirlas al servidor. La ruta también es la clave de la caché.
export const API = {
    destinos: () => 'destinos',
    destino: (id) => 'destinos/' + encodeURIComponent(id),
};

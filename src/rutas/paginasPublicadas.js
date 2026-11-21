// Páginas que GitHub Pages debe servir con estado 200 al abrirlas directo o recargarlas.
// vite.config.js copia index.html con cada uno de estos nombres. Es una lista propia de la
// construcción: no importa los datos del servidor simulado. Las pruebas de
// pruebas/rutas.test.jsx avisan si deja de coincidir con las rutas o con los destinos del mock.

export const PAGINAS_FIJAS = ['mi-viaje'];

export const DESTINOS_PUBLICADOS = [
    'cusco', 'buenos-aires', 'cartagena', 'rapa-nui', 'ciudad-de-mexico', 'nueva-york', 'madrid', 'lisboa', 'tokio',
];

export const PAGINAS_PUBLICADAS = [...PAGINAS_FIJAS, ...DESTINOS_PUBLICADOS.map((id) => 'destinos/' + id)];

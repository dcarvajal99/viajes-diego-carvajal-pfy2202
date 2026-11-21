// Clases de Tailwind que se repiten en varios componentes. Reunirlas aquí mantiene igual
// cada panel, enlace y título del sitio, y cambiarlos es editar una sola línea. Los botones
// tienen su propio componente con variantes (componentes/Boton.jsx).
export const CONTENEDOR = 'mx-auto w-full max-w-6xl px-4 sm:px-6';
export const PANEL = 'rounded-lg border border-borde bg-blanco p-5';
export const ENLACE = 'text-acento underline hover:text-tinta';
export const ENLACE_SIMPLE = 'text-acento hover:text-tinta hover:underline';

export const TITULO_PAGINA = 'text-3xl font-semibold';
export const SUBTITULO = 'text-xl font-semibold';
export const INTRODUCCION = 'mt-1.5 text-suave';
// Línea sobre un listado: «Cargando…» mientras llega y la cantidad después, con el mismo alto.
export const LINEA_ESTADO = 'mb-3 text-sm text-suave';

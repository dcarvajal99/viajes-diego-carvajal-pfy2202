// Punto de entrada. Se inicia el servidor simulado (MSW) y, al mismo tiempo, se dibuja la
// aplicación: la cabecera y el esqueleto aparecen sin esperar al mock, y solo las consultas
// REST y GraphQL esperan a que esté listo (esperarServidor en api/cliente.js).
//
// El mock queda activo también en la versión publicada en GitHub Pages, porque el sitio no
// tiene un backend real. Con un backend, bastaría con iniciarlo solo en desarrollo
// (import.meta.env.DEV) y las peticiones irían al servidor verdadero.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { esperarServidor } from './api/cliente.js';
import { crearClienteGraphQL } from './graphql/cliente.js';
import '@fontsource-variable/inter';
import './estilos.css';

async function iniciarServidorSimulado() {
    const { worker } = await import('./mocks/browser.js');
    return worker.start({
        // El Service Worker vive junto al sitio, dentro de su subcarpeta.
        serviceWorker: { url: import.meta.env.BASE_URL + 'mockServiceWorker.js' },
        // Lo que no es /api (fuentes, imágenes) pasa sin tocar.
        onUnhandledRequest: 'bypass',
        // En la versión publicada no se anota cada petición en la consola.
        quiet: import.meta.env.PROD,
    });
}

const raiz = createRoot(document.getElementById('raiz'));
const servidor = iniciarServidorSimulado();
esperarServidor(servidor);

raiz.render(
    <StrictMode>
        <App clienteGraphQL={crearClienteGraphQL()} />
    </StrictMode>
);

servidor.catch(() => {
    // Sin Service Worker (por ejemplo, en navegación privada de algunos navegadores) no hay API.
    raiz.render(
        <p className="m-8 max-w-xl">
            No se pudo iniciar el servidor simulado de la agencia. Este sitio necesita un navegador con
            Service Workers activos: prueba en una ventana normal de Chrome, Edge, Firefox o Safari.
        </p>
    );
});

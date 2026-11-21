import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { PAGINAS_PUBLICADAS } from './src/rutas/paginasPublicadas.js';

// GitHub Pages no conoce las rutas de React Router: al recargar /destinos/cusco busca un
// archivo con ese nombre. Para cada página de PAGINAS_PUBLICADAS se copia index.html como
// <ruta>.html, que Pages sirve con estado 200, y BrowserRouter dibuja la página que
// corresponde. La copia 404.html atiende todo lo demás: responde 404, pero carga la misma
// aplicación y React Router muestra lo que corresponda.
function copiarRutas() {
    return {
        name: 'copiar-rutas',
        apply: 'build',
        writeBundle(opciones) {
            const indice = join(opciones.dir, 'index.html');
            for (const ruta of [...PAGINAS_PUBLICADAS, '404']) {
                const destino = join(opciones.dir, ruta + '.html');
                mkdirSync(dirname(destino), { recursive: true });
                copyFileSync(indice, destino);
            }
        },
    };
}

// GitHub Pages publica el repositorio en /viajes-diego-carvajal-pfy2202/: la base le indica
// a Vite desde qué ruta se sirven los archivos, y App.jsx usa la misma para React Router.
export default defineConfig({
    base: '/viajes-diego-carvajal-pfy2202/',
    plugins: [react(), tailwindcss(), copiarRutas()],
    // Pruebas automáticas (npm test): API simulada, cliente, caché, estados de una consulta y
    // rutas. Cada archivo corre en Node, salvo useConsulta.test.jsx, que pide un DOM (happy-dom).
    test: {
        include: ['pruebas/**/*.test.{js,jsx}'],
        environment: 'node',
    },
});

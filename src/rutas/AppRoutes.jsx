// Archivo central de rutas: todas las direcciones del sitio se declaran aquí. Cuelgan de la
// Plantilla y React Router elige qué página dibujar según la URL, sin recargar el navegador.
// Cada página se carga bajo demanda con lazy(): su código se descarga la primera vez que se
// visita. El Suspense que muestra «Cargando…» está en la Plantilla.
import { lazy } from 'react';
import { Route, Routes } from 'react-router';
import Plantilla from '../componentes/Plantilla.jsx';

const Destinos = lazy(() => import('../paginas/Destinos.jsx'));
const Destino = lazy(() => import('../paginas/Destino.jsx'));
const MiViaje = lazy(() => import('../paginas/MiViaje.jsx'));
const NoEncontrada = lazy(() => import('../paginas/NoEncontrada.jsx'));

// AppRoutes no usa hooks: las pruebas (pruebas/rutas.test.jsx) leen su árbol de rutas para
// comprobar qué ruta atiende cada dirección, sin dibujar páginas.
function AppRoutes() {
    return (
        <Routes>
            {/* Ruta de diseño: no agrega nada a la URL, solo envuelve a sus hijas */}
            <Route element={<Plantilla />}>
                <Route index element={<Destinos />} />
                {/* Ruta dinámica: :id toma el identificador del destino desde la URL */}
                <Route path="destinos/:id" element={<Destino />} />
                <Route path="mi-viaje" element={<MiViaje />} />
                {/* Cualquier otra dirección. Va al final para que primero se prueben las anteriores */}
                <Route path="*" element={<NoEncontrada />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes;

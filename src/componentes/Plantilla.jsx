// Plantilla común a todas las páginas: cabecera, contenido y pie con el panel de pruebas.
// <Outlet /> es el hueco donde React Router dibuja la página de la ruta actual. Las páginas
// se cargan bajo demanda (lazy): en la primera carga, Suspense muestra un aviso mientras llega
// su código. El pie espera junto con la página, así aparece una sola vez y ya en su lugar
// (si apareciera antes, saltaría hacia abajo al llegar la página). En las navegaciones
// siguientes React Router mantiene la página anterior a la vista mientras llega la nueva.
import { Suspense, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';
import Cabecera from './Cabecera.jsx';
import CargandoPagina from './CargandoPagina.jsx';
import PanelPruebas from './PanelPruebas.jsx';
import { CONTENEDOR } from '../utilidades/estilos.js';

function Plantilla() {
    const { pathname } = useLocation();
    const contenido = useRef(null);
    const rutaAnterior = useRef(pathname);

    // Al cambiar de página: volver arriba y llevar el foco al contenido, para que el teclado
    // y el lector de pantalla partan desde la página nueva.
    useEffect(() => {
        if (rutaAnterior.current === pathname) return;
        rutaAnterior.current = pathname;
        window.scrollTo(0, 0);
        contenido.current?.focus({ preventScroll: true });
    }, [pathname]);

    return (
        <>
            <a
                className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-40 focus:rounded-md focus:bg-tinta focus:px-3 focus:py-2 focus:text-blanco"
                href="#contenido"
            >
                Saltar al contenido
            </a>
            <Cabecera />
            <Suspense
                fallback={
                    <main id="contenido" className={CONTENEDOR + ' min-h-[60vh] pt-7 pb-10'}>
                        <CargandoPagina />
                    </main>
                }
            >
                <main id="contenido" className={CONTENEDOR + ' min-h-[60vh] pt-7 pb-10'} ref={contenido} tabIndex={-1}>
                    <Outlet />
                </main>
                <footer className={CONTENEDOR + ' space-y-4 pb-8'}>
                    <PanelPruebas />
                    <p className="text-[0.8125rem] text-suave">
                        Rumbo Austral es una agencia de viajes ficticia, creada para la asignatura Desarrollo Frontend II
                        (PFY2202) de Duoc UC. Los vuelos, hoteles y precios son de ejemplo.
                    </p>
                </footer>
            </Suspense>
        </>
    );
}

export default Plantilla;

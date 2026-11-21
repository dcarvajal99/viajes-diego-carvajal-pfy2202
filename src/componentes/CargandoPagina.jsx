// Aviso mientras llega el código de una página (fallback de Suspense, solo en la primera carga).
// Si tarda más de lo normal, ofrece recargar: así la persona nunca queda frente a un «Cargando…»
// sin salida.
import { useEffect, useState } from 'react';
import Boton from './Boton.jsx';

const ESPERA_NORMAL = 6000;

function CargandoPagina() {
    const [demorado, setDemorado] = useState(false);

    useEffect(() => {
        const plazo = setTimeout(() => setDemorado(true), ESPERA_NORMAL);
        return () => clearTimeout(plazo);
    }, []);

    return (
        <div role="status">
            <p className="text-suave">Cargando…</p>
            {demorado && (
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                    <span>La página está tardando más de lo normal.</span>
                    <Boton tamano="chico" onClick={() => window.location.reload()}>Recargar la página</Boton>
                </div>
            )}
        </div>
    );
}

export default CargandoPagina;

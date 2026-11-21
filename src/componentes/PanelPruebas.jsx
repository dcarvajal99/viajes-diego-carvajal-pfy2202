// Panel para probar cómo reacciona el sitio ante distintas condiciones del servidor
// simulado. Elegir un modo cambia la respuesta de los handlers de MSW; «Vaciar caché»
// olvida las respuestas guardadas y la página abierta vuelve a consultar al servidor.
import { useState } from 'react';
import Boton from './Boton.jsx';
import { vaciar } from '../api/cache.js';
import { useSimulacion } from '../hooks/useExterno.js';
import { MODOS, cambiarSimulacion, obtenerSimulacion } from '../mocks/simulacion.js';

function PanelPruebas() {
    const modo = useSimulacion();
    const [mensaje, setMensaje] = useState('');
    // El modo se guarda en la sesión: si al cargar el sitio quedó uno distinto de «Normal», el
    // panel parte abierto para que se note. Después se abre y se cierra solo a mano.
    const [abiertoAlInicio] = useState(() => obtenerSimulacion() !== 'normal');

    function vaciarCache() {
        vaciar();
        setMensaje('Caché vaciada: la página vuelve a consultar al servidor.');
    }

    return (
        <details className="rounded-lg border border-borde bg-blanco p-4" open={abiertoAlInicio}>
            <summary className="cursor-pointer font-medium">
                Probar el servidor simulado{modo !== 'normal' && ': ' + MODOS.find((item) => item.id === modo).nombre}
            </summary>
            <p className="mt-2 text-sm text-suave">
                La API REST de este sitio es simulada con Mock Service Worker. Elige cómo debe responder. Las páginas ya
                visitadas se muestran desde la caché por 5 minutos: usa «Actualizar» en cada página o vacía la caché.
            </p>
            <fieldset className="mt-3">
                <legend className="sr-only">Condición del servidor</legend>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {MODOS.map((opcion) => (
                        <label key={opcion.id} className="flex cursor-pointer gap-2 rounded-md border border-borde p-3 text-sm has-checked:border-acento">
                            <input
                                type="radio"
                                name="simulacion"
                                value={opcion.id}
                                className="mt-0.5 accent-acento"
                                checked={modo === opcion.id}
                                onChange={() => cambiarSimulacion(opcion.id)}
                            />
                            <span>
                                <span className="block font-medium">{opcion.nombre}</span>
                                <span className="text-suave">{opcion.detalle}</span>
                            </span>
                        </label>
                    ))}
                </div>
            </fieldset>
            <div className="mt-3 flex flex-wrap items-center gap-3">
                <Boton tamano="chico" onClick={vaciarCache}>Vaciar caché</Boton>
                <span className="text-sm text-suave" role="status">{mensaje}</span>
            </div>
        </details>
    );
}

export default PanelPruebas;

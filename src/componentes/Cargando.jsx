// Indicador de carga con la forma del contenido que viene (esqueleto). Cada variante repite las
// líneas de la tarjeta real con su misma altura, así la página no se mueve cuando llegan los
// datos. Es solo visual (aria-hidden): el aviso para el lector de pantalla lo da la línea de
// estado de cada página.
import { PANEL } from '../utilidades/estilos.js';

// Una línea de texto simulada: ocupa el alto de la línea real y dibuja una barra al medio.
function Linea({ alto, ancho, fuerte = false }) {
    return (
        <div className={'flex items-center ' + alto}>
            <div className={'h-3 rounded ' + ancho + (fuerte ? ' bg-borde' : ' bg-lienzo')} />
        </div>
    );
}

function Pastillas({ anchos }) {
    return (
        <div className="flex flex-wrap gap-1.5">
            {anchos.map((ancho, indice) => <div key={indice} className={'h-[1.375rem] rounded-full bg-lienzo ' + ancho} />)}
        </div>
    );
}

// Como TarjetaDestino: nombre, país y región, actividades y el enlace final.
function DestinoCargando() {
    return (
        <div className={PANEL + ' animate-pulse'}>
            <Linea alto="h-7" ancho="w-1/2" fuerte />
            <Linea alto="h-5" ancho="w-1/3" />
            <div className="mt-3"><Pastillas anchos={['w-24', 'w-20', 'w-28', 'w-16']} /></div>
            <div className="mt-4"><Linea alto="h-5" ancho="w-2/5" /></div>
        </div>
    );
}

// Como TarjetaOpcion (vuelo u hotel): título y tres líneas a la izquierda; precio y botón a la derecha.
function OpcionCargando() {
    return (
        <div className="flex animate-pulse flex-col gap-3 rounded-lg border border-borde bg-blanco p-4 sm:flex-row sm:justify-between sm:p-5">
            <div className="min-w-0 grow">
                <Linea alto="h-6" ancho="w-48" fuerte />
                <div className="mt-1 space-y-0.5">
                    <Linea alto="h-5" ancho="w-56 max-w-full" />
                    <Linea alto="h-5" ancho="w-56 max-w-full" />
                    <Linea alto="h-5" ancho="w-80 max-w-full" />
                </div>
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-end">
                <div className="sm:text-right">
                    <Linea alto="h-7" ancho="w-24" fuerte />
                    <Linea alto="h-4" ancho="w-32" />
                    <div className="mt-1"><Linea alto="h-5" ancho="w-28" /></div>
                </div>
                <div className="h-[1.875rem] w-28 rounded-md bg-lienzo" />
            </div>
        </div>
    );
}

// Como la ficha de un destino: descripción, tres datos, el título de las actividades y sus etiquetas.
// Va dentro del panel de la ficha, que ya pone el borde y el relleno.
function FichaCargando() {
    return (
        <div className="animate-pulse">
            <div className="mb-4">
                <Linea alto="h-6" ancho="w-full" />
                <Linea alto="h-6 sm:hidden" ancho="w-full" />
                <Linea alto="h-6" ancho="w-2/3" />
            </div>
            <div className="mb-4 grid gap-3 sm:grid-cols-3">
                {['w-24', 'w-16', 'w-20'].map((ancho) => (
                    <div key={ancho}>
                        <Linea alto="h-[1.21875rem]" ancho={ancho} />
                        <Linea alto="h-5" ancho="w-4/5" fuerte />
                        {/* En pantallas anchas el dato suele ocupar dos líneas; en el teléfono, una */}
                        <div className="hidden sm:block"><Linea alto="h-5" ancho="w-1/2" /></div>
                    </div>
                ))}
            </div>
            <div className="mb-2"><Linea alto="h-5" ancho="w-40" /></div>
            <Pastillas anchos={['w-24', 'w-20', 'w-28', 'w-24']} />
        </div>
    );
}

function Cargando({ variante, cantidad = 3 }) {
    if (variante === 'ficha') return <FichaCargando />;
    const lista = Array.from({ length: cantidad }, (_, indice) => indice);
    if (variante === 'destino') {
        return (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-4" aria-hidden="true">
                {lista.map((indice) => <DestinoCargando key={indice} />)}
            </div>
        );
    }
    return (
        <div className="space-y-3" aria-hidden="true">
            {lista.map((indice) => <OpcionCargando key={indice} />)}
        </div>
    );
}

export default Cargando;

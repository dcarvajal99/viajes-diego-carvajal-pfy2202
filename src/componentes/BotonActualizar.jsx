// Vuelve a pedir los datos al servidor aunque estén en la caché. Mientras la petición está
// en curso dice «Actualizando…» y no acepta otro clic, para no repetir la consulta. El ancho
// mínimo calza con los dos textos, así el botón no cambia de tamaño al pasar de uno al otro.
import Boton from './Boton.jsx';

function BotonActualizar({ cargando, onActualizar }) {
    return (
        <Boton tamano="chico" className="min-w-30" aria-disabled={cargando} onClick={() => !cargando && onActualizar()}>
            {cargando ? 'Actualizando…' : 'Actualizar'}
        </Boton>
    );
}

export default BotonActualizar;

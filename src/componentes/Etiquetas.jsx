// Lista de etiquetas pequeñas (actividades de un destino, servicios de un hotel).
function Etiquetas({ textos, nombre }) {
    return (
        <ul className="flex flex-wrap gap-1.5" aria-label={nombre}>
            {textos.map((texto) => (
                <li key={texto} className="rounded-full border border-borde bg-lienzo px-2 py-0.5 text-xs">
                    {texto}
                </li>
            ))}
        </ul>
    );
}

export default Etiquetas;

// Cuántas peticiones de red hay en curso, sean REST o GraphQL. Cada petición suma al empezar y
// resta al terminar (bien o mal), y el indicador de la cabecera se suscribe a este contador.

let enCurso = 0;
const oyentes = new Set();

export function comenzarPeticion() {
    enCurso += 1;
    avisar();
}

export function terminarPeticion() {
    enCurso -= 1;
    avisar();
}

export function peticionesEnCurso() {
    return enCurso;
}

// Para useSyncExternalStore.
export function suscribirActividad(oyente) {
    oyentes.add(oyente);
    return () => oyentes.delete(oyente);
}

function avisar() {
    oyentes.forEach((oyente) => oyente());
}

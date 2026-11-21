// Funciones reutilizables de formato, en español de Chile.

const NUMERO = new Intl.NumberFormat('es-CL');
const DIA_Y_HORA = new Intl.DateTimeFormat('es-CL', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false });
const FECHA = new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });

// 'AAAA-MM-DDTHH:MM' como fecha local, sin zona horaria (las horas son locales de cada aeropuerto).
function aFecha(texto) {
    const [anio, mes, dia, hora = 0, minuto = 0] = texto.split(/[-T:]/).map(Number);
    return new Date(anio, mes - 1, dia, hora, minuto);
}

// 19990 → "$19.990"
export const formatearPesos = (valor) => '$' + NUMERO.format(valor);

// '2026-12-10T06:40' → "jue, 10 dic, 06:40"
export const formatearDiaYHora = (texto) => DIA_Y_HORA.format(aFecha(texto));

// '2027-01-10' → "10 ene 2027"
export const formatearFecha = (texto) => FECHA.format(aFecha(texto));

// 225 → "3 h 45 min"
export function formatearDuracion(minutos) {
    const horas = Math.floor(minutos / 60);
    const resto = minutos % 60;
    return (horas ? horas + ' h' : '') + (horas && resto ? ' ' : '') + (resto ? resto + ' min' : '');
}

// contar(1, 'destino', 'destinos') → "1 destino"; contar(4, ...) → "4 destinos"
export const contar = (cantidad, singular, plural) => cantidad + ' ' + (cantidad === 1 ? singular : plural);

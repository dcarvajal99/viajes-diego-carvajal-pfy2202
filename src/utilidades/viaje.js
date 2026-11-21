// Reglas del viaje, en un solo lugar: las usan las páginas para mostrar qué se puede elegir y
// el servidor simulado para validar una reserva. Son funciones sin estado.

export const PASAJEROS_MAXIMO = 6;
export const PERSONAS_POR_HABITACION = 2;

// Solo la fecha de un 'AAAA-MM-DDTHH:MM' (o 'AAAA-MM-DD').
const fecha = (texto) => texto.slice(0, 10);

// Noches entre la ida y la vuelta del vuelo.
export function nochesDe(vuelo) {
    const dia = 24 * 60 * 60 * 1000;
    return Math.round((Date.parse(fecha(vuelo.vuelta)) - Date.parse(fecha(vuelo.ida))) / dia);
}

export function habitacionesPara(pasajeros) {
    return Math.ceil(pasajeros / PERSONAS_POR_HABITACION);
}

export function pasajerosValidos(pasajeros) {
    return Number.isInteger(pasajeros) && pasajeros >= 1 && pasajeros <= PASAJEROS_MAXIMO;
}

// El hotel recibe huéspedes durante todo el viaje del vuelo elegido.
export function hotelCubreFechas(hotel, vuelo) {
    return fecha(vuelo.ida) >= hotel.disponibleDesde && fecha(vuelo.vuelta) <= hotel.disponibleHasta;
}

// Por qué no se puede elegir un vuelo, o null si se puede.
export function motivoVuelo(vuelo, pasajeros) {
    if (vuelo.asientosDisponibles === 0) return 'Agotado';
    if (vuelo.asientosDisponibles < pasajeros) return 'Quedan ' + vuelo.asientosDisponibles + ' asientos';
    return null;
}

// Por qué no se puede elegir un hotel (con el vuelo elegido, si hay uno), o null si se puede.
export function motivoHotel(hotel, vuelo, pasajeros) {
    if (hotel.habitacionesDisponibles === 0) return 'Sin habitaciones';
    if (hotel.habitacionesDisponibles < habitacionesPara(pasajeros)) {
        return 'Quedan ' + hotel.habitacionesDisponibles + (hotel.habitacionesDisponibles === 1 ? ' habitación' : ' habitaciones');
    }
    if (vuelo && !hotelCubreFechas(hotel, vuelo)) return 'No disponible en tus fechas';
    return null;
}

// Desglose del precio: vuelos por pasajero y hotel por habitación y noche.
export function calcularTotal({ vuelo, hotel, pasajeros }) {
    const noches = nochesDe(vuelo);
    const habitaciones = habitacionesPara(pasajeros);
    const vuelos = vuelo.precio * pasajeros;
    const alojamiento = hotel ? hotel.precioNoche * noches * habitaciones : 0;
    return { noches, habitaciones, vuelos, alojamiento, total: vuelos + alojamiento };
}

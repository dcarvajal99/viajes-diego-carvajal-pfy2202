// API GraphQL simulada: un esquema real (con tipos, argumentos y validación) que se ejecuta con
// la librería `graphql` dentro del handler de MSW. Así el servidor responde solo los campos que
// pide cada consulta, rechaza las consultas mal escritas y devuelve errores con formato GraphQL.
import { GraphQLError, buildSchema, graphql } from 'graphql';
import { DESTINOS, HOTELES, VUELOS } from './datos.js';
import { calcularTotal, habitacionesPara, hotelCubreFechas, pasajerosValidos } from '../utilidades/viaje.js';

export const ESQUEMA = buildSchema(`
  "Vuelo de ida y vuelta desde Santiago. El precio es por pasajero."
  type Vuelo {
    id: ID!
    aerolinea: String!
    numero: String!
    origen: String!
    ida: String!
    vuelta: String!
    duracion: Int!
    escalas: Int!
    precio: Int!
    asientosDisponibles: Int!
  }

  "Hotel del destino. El precio es por habitación doble y noche."
  type Hotel {
    id: ID!
    nombre: String!
    estrellas: Int!
    barrio: String!
    precioNoche: Int!
    habitacionesDisponibles: Int!
    disponibleDesde: String!
    disponibleHasta: String!
    servicios: [String!]!
  }

  type Reserva {
    codigo: String!
    pasajeros: Int!
    noches: Int!
    habitaciones: Int!
    total: Int!
    vuelo: Vuelo!
    hotel: Hotel!
  }

  type Query {
    vuelos(destinoId: ID!): [Vuelo!]!
    hoteles(destinoId: ID!): [Hotel!]!
  }

  type Mutation {
    reservar(vueloId: ID!, hotelId: ID!, pasajeros: Int!): Reserva!
  }
`);

// Error con un código en `extensions`, para que el cliente distinga el caso.
function errorConCodigo(mensaje, codigo) {
    return new GraphQLError(mensaje, { extensions: { code: codigo } });
}

function destinoExistente(destinoId) {
    if (!DESTINOS.some((destino) => destino.id === destinoId)) {
        throw errorConCodigo('No existe el destino «' + destinoId + '».', 'NOT_FOUND');
    }
}

let correlativo = 1000;

const RESOLVERS = {
    vuelos: ({ destinoId }) => {
        destinoExistente(destinoId);
        return VUELOS.filter((vuelo) => vuelo.destinoId === destinoId);
    },
    hoteles: ({ destinoId }) => {
        destinoExistente(destinoId);
        return HOTELES.filter((hotel) => hotel.destinoId === destinoId);
    },
    // Valida todo antes de descontar: si algo falla, no cambia nada.
    reservar: ({ vueloId, hotelId, pasajeros }) => {
        const vuelo = VUELOS.find((item) => item.id === vueloId);
        const hotel = HOTELES.find((item) => item.id === hotelId);
        if (!vuelo || !hotel) throw errorConCodigo('El vuelo o el hotel ya no existe.', 'NOT_FOUND');
        if (vuelo.destinoId !== hotel.destinoId) throw errorConCodigo('El vuelo y el hotel son de destinos distintos.', 'DATOS_INVALIDOS');
        if (!pasajerosValidos(pasajeros)) throw errorConCodigo('La cantidad de pasajeros debe estar entre 1 y 6.', 'DATOS_INVALIDOS');
        if (vuelo.asientosDisponibles < pasajeros) {
            throw errorConCodigo('El vuelo ' + vuelo.numero + ' tiene ' + vuelo.asientosDisponibles + ' asientos libres y se pidieron ' + pasajeros + '.', 'SIN_DISPONIBILIDAD');
        }
        const habitaciones = habitacionesPara(pasajeros);
        if (hotel.habitacionesDisponibles < habitaciones) {
            throw errorConCodigo(hotel.nombre + ' tiene ' + hotel.habitacionesDisponibles + ' habitaciones libres y se necesitan ' + habitaciones + '.', 'SIN_DISPONIBILIDAD');
        }
        if (!hotelCubreFechas(hotel, vuelo)) throw errorConCodigo(hotel.nombre + ' no recibe huéspedes en las fechas del vuelo.', 'SIN_DISPONIBILIDAD');

        vuelo.asientosDisponibles -= pasajeros;
        hotel.habitacionesDisponibles -= habitaciones;
        const { noches, total } = calcularTotal({ vuelo, hotel, pasajeros });
        correlativo += 1;
        return { codigo: 'RA-' + correlativo, pasajeros, noches, habitaciones, total, vuelo, hotel };
    },
};

// Ejecuta una operación como lo haría un servidor GraphQL: { data, errors }.
export function ejecutar(consulta, variables) {
    return graphql({ schema: ESQUEMA, source: consulta, rootValue: RESOLVERS, variableValues: variables });
}

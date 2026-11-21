// Operaciones GraphQL de la aplicación. Cada consulta pide exactamente los campos que muestra la
// interfaz; los fragmentos evitan repetir la lista de campos de un vuelo o un hotel.
import { gql } from '@apollo/client';

const CAMPOS_VUELO = gql`
  fragment CamposVuelo on Vuelo {
    id
    aerolinea
    numero
    origen
    ida
    vuelta
    duracion
    escalas
    precio
    asientosDisponibles
  }
`;

const CAMPOS_HOTEL = gql`
  fragment CamposHotel on Hotel {
    id
    nombre
    estrellas
    barrio
    precioNoche
    habitacionesDisponibles
    disponibleDesde
    disponibleHasta
    servicios
  }
`;

// Una sola petición trae los vuelos y los hoteles de un destino.
export const OPCIONES_DE_VIAJE = gql`
  query OpcionesDeViaje($destinoId: ID!) {
    vuelos(destinoId: $destinoId) {
      ...CamposVuelo
    }
    hoteles(destinoId: $destinoId) {
      ...CamposHotel
    }
  }
  ${CAMPOS_VUELO}
  ${CAMPOS_HOTEL}
`;

// La respuesta trae la disponibilidad nueva del vuelo y del hotel: Apollo la guarda en su caché
// (por tipo e id) y las listas de opciones se actualizan solas, sin volver a consultarlas.
export const RESERVAR = gql`
  mutation Reservar($vueloId: ID!, $hotelId: ID!, $pasajeros: Int!) {
    reservar(vueloId: $vueloId, hotelId: $hotelId, pasajeros: $pasajeros) {
      codigo
      pasajeros
      noches
      habitaciones
      total
      vuelo {
        id
        asientosDisponibles
      }
      hotel {
        id
        habitacionesDisponibles
      }
    }
  }
`;

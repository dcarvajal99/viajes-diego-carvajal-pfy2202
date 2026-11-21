// Datos del servidor simulado de Rumbo Austral, una agencia de viajes ficticia que vende
// viajes desde Santiago. Los destinos los entrega la API REST; los vuelos y hoteles, la API
// GraphQL. Precios en pesos chilenos.

export const DESTINOS = [
    {
        id: 'cusco', nombre: 'Cusco', pais: 'Perú', region: 'Sudamérica',
        actividades: ['Machu Picchu', 'Valle Sagrado', 'Mercado de San Pedro', 'Montaña de Colores'],
        descripcion: 'La antigua capital inca, punto de partida hacia Machu Picchu y los pueblos del Valle Sagrado.',
        mejorEpoca: 'Mayo a septiembre, en la estación seca', idioma: 'Español y quechua', moneda: 'Sol peruano (PEN)',
    },
    {
        id: 'buenos-aires', nombre: 'Buenos Aires', pais: 'Argentina', region: 'Sudamérica',
        actividades: ['Tango en San Telmo', 'Caminito en La Boca', 'Teatro Colón', 'Parrillas de Palermo'],
        descripcion: 'Avenidas amplias, cafés de barrio, teatro y la mejor carne a la parrilla, a dos horas de Santiago.',
        mejorEpoca: 'Marzo a mayo y septiembre a noviembre', idioma: 'Español', moneda: 'Peso argentino (ARS)',
    },
    {
        id: 'cartagena', nombre: 'Cartagena', pais: 'Colombia', region: 'Sudamérica',
        actividades: ['Ciudad amurallada', 'Islas del Rosario', 'Barrio Getsemaní', 'Castillo San Felipe'],
        descripcion: 'Calles coloniales de colores dentro de una muralla junto al mar Caribe.',
        mejorEpoca: 'Diciembre a abril, con menos lluvias', idioma: 'Español', moneda: 'Peso colombiano (COP)',
    },
    {
        id: 'rapa-nui', nombre: 'Rapa Nui', pais: 'Chile', region: 'Oceanía',
        actividades: ['Moáis de Rano Raraku', 'Playa Anakena', 'Volcán Rano Kau', 'Festival Tapu Rapa Nui'],
        descripcion: 'La isla de los moáis, en medio del Pacífico, con cultura polinésica viva y playas de arena blanca.',
        mejorEpoca: 'Enero y febrero, con el festival de la isla', idioma: 'Español y rapanui', moneda: 'Peso chileno (CLP)',
    },
    {
        id: 'ciudad-de-mexico', nombre: 'Ciudad de México', pais: 'México', region: 'Norteamérica',
        actividades: ['Teotihuacán', 'Coyoacán', 'Trajineras de Xochimilco', 'Museo de Antropología'],
        descripcion: 'Una de las ciudades más grandes del mundo: pirámides, museos, mercados y comida callejera.',
        mejorEpoca: 'Noviembre a abril, en la estación seca', idioma: 'Español', moneda: 'Peso mexicano (MXN)',
    },
    {
        id: 'nueva-york', nombre: 'Nueva York', pais: 'Estados Unidos', region: 'Norteamérica',
        actividades: ['Central Park', 'Museo MoMA', 'Musicales de Broadway', 'Puente de Brooklyn'],
        descripcion: 'Rascacielos, museos de primer nivel y barrios que parecen ciudades distintas.',
        mejorEpoca: 'Abril a junio y septiembre a noviembre', idioma: 'Inglés', moneda: 'Dólar estadounidense (USD)',
    },
    {
        id: 'madrid', nombre: 'Madrid', pais: 'España', region: 'Europa',
        actividades: ['Museo del Prado', 'Parque del Retiro', 'Tapas en La Latina', 'Toledo en un día'],
        descripcion: 'Arte, plazas y vida nocturna en el centro de la península, con escapadas a ciudades históricas.',
        mejorEpoca: 'Abril a junio y septiembre a octubre', idioma: 'Español', moneda: 'Euro (EUR)',
    },
    {
        id: 'lisboa', nombre: 'Lisboa', pais: 'Portugal', region: 'Europa',
        actividades: ['Barrio de Alfama', 'Torre de Belém', 'Palacios de Sintra', 'Tranvía 28'],
        descripcion: 'Colinas, miradores y azulejos junto al río Tajo, con el océano Atlántico a media hora.',
        mejorEpoca: 'Marzo a mayo y septiembre a octubre', idioma: 'Portugués', moneda: 'Euro (EUR)',
    },
    {
        id: 'tokio', nombre: 'Tokio', pais: 'Japón', region: 'Asia',
        actividades: ['Templo Senso-ji', 'Cruce de Shibuya', 'Excursión al monte Fuji', 'Mercado de Tsukiji'],
        descripcion: 'Templos tradicionales y barrios futuristas en una ciudad ordenada y segura.',
        mejorEpoca: 'Marzo a mayo, con los cerezos en flor, y octubre a noviembre', idioma: 'Japonés', moneda: 'Yen (JPY)',
    },
];

// Vuelos de ida y vuelta desde Santiago. `precio` es por pasajero; `duracion`, minutos por tramo.
function vuelo(id, destinoId, aerolinea, numero, ida, vuelta, duracion, escalas, precio, asientosDisponibles) {
    return { id, destinoId, aerolinea, numero, origen: 'Santiago (SCL)', ida, vuelta, duracion, escalas, precio, asientosDisponibles };
}

export const VUELOS = [
    vuelo('v-cusco-1', 'cusco', 'LATAM', 'LA2400', '2026-12-10T06:40', '2026-12-16T13:05', 225, 1, 389990, 12),
    vuelo('v-cusco-2', 'cusco', 'Sky Airline', 'H2 1630', '2027-01-14T09:15', '2027-01-21T15:40', 240, 1, 329990, 4),
    vuelo('v-cusco-3', 'cusco', 'LATAM', 'LA2402', '2027-02-05T06:40', '2027-02-12T13:05', 225, 1, 409990, 18),
    vuelo('v-buenos-aires-1', 'buenos-aires', 'Aerolíneas Argentinas', 'AR1281', '2026-12-04T08:00', '2026-12-08T19:30', 125, 0, 219990, 20),
    vuelo('v-buenos-aires-2', 'buenos-aires', 'JetSMART', 'JA0712', '2027-01-08T06:05', '2027-01-13T22:10', 130, 0, 149990, 0),
    vuelo('v-buenos-aires-3', 'buenos-aires', 'LATAM', 'LA0441', '2027-02-12T17:20', '2027-02-17T07:45', 125, 0, 239990, 9),
    vuelo('v-cartagena-1', 'cartagena', 'Avianca', 'AV0124', '2026-12-18T01:10', '2026-12-26T14:20', 400, 1, 549990, 6),
    vuelo('v-cartagena-2', 'cartagena', 'LATAM', 'LA0590', '2027-01-20T00:45', '2027-01-29T16:00', 385, 1, 599990, 15),
    vuelo('v-cartagena-3', 'cartagena', 'Copa Airlines', 'CM0228', '2027-02-25T05:30', '2027-03-04T21:10', 410, 1, 509990, 3),
    vuelo('v-rapa-nui-1', 'rapa-nui', 'LATAM', 'LA0841', '2026-12-27T09:30', '2027-01-03T14:15', 330, 0, 459990, 2),
    vuelo('v-rapa-nui-2', 'rapa-nui', 'LATAM', 'LA0843', '2027-02-01T09:30', '2027-02-09T14:15', 330, 0, 529990, 10),
    vuelo('v-rapa-nui-3', 'rapa-nui', 'LATAM', 'LA0845', '2027-02-20T09:30', '2027-02-27T14:15', 330, 0, 489990, 14),
    vuelo('v-ciudad-de-mexico-1', 'ciudad-de-mexico', 'Aeroméxico', 'AM0011', '2026-12-06T23:55', '2026-12-14T15:30', 520, 0, 689990, 22),
    vuelo('v-ciudad-de-mexico-2', 'ciudad-de-mexico', 'LATAM', 'LA0622', '2027-01-25T01:20', '2027-02-03T11:45', 545, 1, 619990, 8),
    vuelo('v-ciudad-de-mexico-3', 'ciudad-de-mexico', 'Copa Airlines', 'CM0390', '2027-03-08T05:30', '2027-03-15T22:00', 590, 1, 579990, 5),
    vuelo('v-nueva-york-1', 'nueva-york', 'LATAM', 'LA0532', '2026-12-15T22:30', '2026-12-23T19:00', 640, 0, 1049990, 7),
    vuelo('v-nueva-york-2', 'nueva-york', 'American Airlines', 'AA0940', '2027-01-30T21:50', '2027-02-07T17:30', 650, 0, 989990, 16),
    vuelo('v-nueva-york-3', 'nueva-york', 'Delta', 'DL0146', '2027-03-12T23:10', '2027-03-20T20:15', 700, 1, 899990, 11),
    vuelo('v-madrid-1', 'madrid', 'Iberia', 'IB6830', '2026-12-08T12:40', '2026-12-20T23:55', 800, 0, 1149990, 9),
    vuelo('v-madrid-2', 'madrid', 'LATAM', 'LA0704', '2027-01-18T12:10', '2027-02-01T23:20', 790, 0, 1089990, 13),
    vuelo('v-madrid-3', 'madrid', 'Air Europa', 'UX0042', '2027-03-02T16:15', '2027-03-14T23:50', 810, 0, 999990, 1),
    vuelo('v-lisboa-1', 'lisboa', 'TAP Air Portugal', 'TP0108', '2026-12-12T15:30', '2026-12-22T22:40', 900, 1, 1199990, 10),
    vuelo('v-lisboa-2', 'lisboa', 'LATAM', 'LA0710', '2027-02-04T12:10', '2027-02-15T21:05', 920, 1, 1129990, 6),
    vuelo('v-lisboa-3', 'lisboa', 'Iberia', 'IB6832', '2027-03-18T12:40', '2027-03-29T21:30', 950, 1, 1059990, 19),
    vuelo('v-tokio-1', 'tokio', 'ANA', 'NH0006', '2027-01-09T23:40', '2027-01-23T18:10', 1560, 1, 1899990, 5),
    vuelo('v-tokio-2', 'tokio', 'LATAM', 'LA0800', '2027-03-20T22:15', '2027-04-03T17:30', 1620, 1, 2049990, 12),
    vuelo('v-tokio-3', 'tokio', 'Japan Airlines', 'JL0011', '2027-04-02T23:55', '2027-04-14T18:40', 1590, 1, 2149990, 3),
];

// Hoteles. `precioNoche` es por habitación doble; disponibles entre las dos fechas.
function hotel(id, destinoId, nombre, estrellas, barrio, precioNoche, habitacionesDisponibles, disponibleDesde, disponibleHasta, servicios) {
    return { id, destinoId, nombre, estrellas, barrio, precioNoche, habitacionesDisponibles, disponibleDesde, disponibleHasta, servicios };
}

const TODA_LA_TEMPORADA = ['2026-12-01', '2027-04-30'];

export const HOTELES = [
    hotel('h-cusco-1', 'cusco', 'Casa Inti', 3, 'San Blas', 54990, 6, ...TODA_LA_TEMPORADA, ['Desayuno', 'Wifi', 'Té de coca']),
    hotel('h-cusco-2', 'cusco', 'Hotel Plaza de Armas', 4, 'Centro histórico', 89990, 3, ...TODA_LA_TEMPORADA, ['Desayuno', 'Wifi', 'Oxígeno']),
    hotel('h-cusco-3', 'cusco', 'Tambo del Valle', 5, 'Valle Sagrado', 159990, 2, '2027-01-10', '2027-04-30', ['Desayuno', 'Spa', 'Traslados']),
    hotel('h-buenos-aires-1', 'buenos-aires', 'Hostal San Telmo', 3, 'San Telmo', 45990, 8, ...TODA_LA_TEMPORADA, ['Desayuno', 'Wifi']),
    hotel('h-buenos-aires-2', 'buenos-aires', 'Palermo Soho Suites', 4, 'Palermo', 79990, 5, ...TODA_LA_TEMPORADA, ['Desayuno', 'Piscina', 'Wifi']),
    hotel('h-buenos-aires-3', 'buenos-aires', 'Gran Hotel Recoleta', 5, 'Recoleta', 139990, 0, ...TODA_LA_TEMPORADA, ['Desayuno', 'Spa', 'Gimnasio']),
    hotel('h-cartagena-1', 'cartagena', 'Casa Getsemaní', 3, 'Getsemaní', 64990, 7, ...TODA_LA_TEMPORADA, ['Desayuno', 'Piscina']),
    hotel('h-cartagena-2', 'cartagena', 'Hotel Murallas', 4, 'Ciudad amurallada', 109990, 4, ...TODA_LA_TEMPORADA, ['Desayuno', 'Piscina', 'Terraza']),
    hotel('h-cartagena-3', 'cartagena', 'Bocagrande Resort', 5, 'Bocagrande', 149990, 6, '2027-01-15', '2027-04-30', ['Todo incluido', 'Playa', 'Spa']),
    hotel('h-rapa-nui-1', 'rapa-nui', 'Cabañas Hanga Roa', 3, 'Hanga Roa', 74990, 3, ...TODA_LA_TEMPORADA, ['Desayuno', 'Arriendo de bicicletas']),
    hotel('h-rapa-nui-2', 'rapa-nui', 'Hotel Ahu Tahai', 4, 'Tahai', 119990, 2, ...TODA_LA_TEMPORADA, ['Desayuno', 'Vista al mar']),
    hotel('h-rapa-nui-3', 'rapa-nui', 'Eco Lodge Anakena', 5, 'Anakena', 219990, 1, '2027-02-01', '2027-04-30', ['Pensión completa', 'Excursiones']),
    hotel('h-ciudad-de-mexico-1', 'ciudad-de-mexico', 'Hotel Coyoacán', 3, 'Coyoacán', 49990, 9, ...TODA_LA_TEMPORADA, ['Wifi', 'Café']),
    hotel('h-ciudad-de-mexico-2', 'ciudad-de-mexico', 'Roma Norte Boutique', 4, 'Roma Norte', 84990, 4, ...TODA_LA_TEMPORADA, ['Desayuno', 'Terraza', 'Wifi']),
    hotel('h-ciudad-de-mexico-3', 'ciudad-de-mexico', 'Gran Reforma', 5, 'Paseo de la Reforma', 149990, 6, ...TODA_LA_TEMPORADA, ['Desayuno', 'Spa', 'Gimnasio']),
    hotel('h-nueva-york-1', 'nueva-york', 'Brooklyn Lofts', 3, 'Brooklyn', 129990, 5, ...TODA_LA_TEMPORADA, ['Wifi', 'Cocina']),
    hotel('h-nueva-york-2', 'nueva-york', 'Midtown Central', 4, 'Midtown', 219990, 3, ...TODA_LA_TEMPORADA, ['Desayuno', 'Gimnasio']),
    hotel('h-nueva-york-3', 'nueva-york', 'Park Avenue Hotel', 5, 'Upper East Side', 389990, 2, '2027-01-05', '2027-04-30', ['Desayuno', 'Spa', 'Conserjería']),
    hotel('h-madrid-1', 'madrid', 'Hostal La Latina', 3, 'La Latina', 69990, 6, ...TODA_LA_TEMPORADA, ['Wifi', 'Desayuno']),
    hotel('h-madrid-2', 'madrid', 'Hotel Gran Vía', 4, 'Gran Vía', 119990, 4, ...TODA_LA_TEMPORADA, ['Desayuno', 'Terraza']),
    hotel('h-madrid-3', 'madrid', 'Palacio del Retiro', 5, 'Retiro', 239990, 2, ...TODA_LA_TEMPORADA, ['Desayuno', 'Spa', 'Gimnasio']),
    hotel('h-lisboa-1', 'lisboa', 'Casa de Alfama', 3, 'Alfama', 64990, 5, ...TODA_LA_TEMPORADA, ['Desayuno', 'Mirador']),
    hotel('h-lisboa-2', 'lisboa', 'Hotel Chiado', 4, 'Chiado', 109990, 3, ...TODA_LA_TEMPORADA, ['Desayuno', 'Wifi']),
    hotel('h-lisboa-3', 'lisboa', 'Quinta de Sintra', 5, 'Sintra', 189990, 4, '2027-02-01', '2027-04-30', ['Desayuno', 'Piscina', 'Jardines']),
    hotel('h-tokio-1', 'tokio', 'Asakusa Ryokan', 3, 'Asakusa', 79990, 6, ...TODA_LA_TEMPORADA, ['Desayuno japonés', 'Baño termal']),
    hotel('h-tokio-2', 'tokio', 'Shinjuku Tower Hotel', 4, 'Shinjuku', 139990, 5, ...TODA_LA_TEMPORADA, ['Wifi', 'Gimnasio']),
    hotel('h-tokio-3', 'tokio', 'Ginza Imperial', 5, 'Ginza', 289990, 2, ...TODA_LA_TEMPORADA, ['Desayuno', 'Spa', 'Conserjería']),
];

// Copia de los datos originales: el servidor simulado descuenta asientos y habitaciones al
// reservar, y reiniciarDatos() los devuelve a su estado inicial (al recargar o en las pruebas).
const ORIGINALES = { vuelos: VUELOS.map((item) => ({ ...item })), hoteles: HOTELES.map((item) => ({ ...item })) };

export function reiniciarDatos() {
    ORIGINALES.vuelos.forEach((original, indice) => Object.assign(VUELOS[indice], original));
    ORIGINALES.hoteles.forEach((original, indice) => Object.assign(HOTELES[indice], original));
}

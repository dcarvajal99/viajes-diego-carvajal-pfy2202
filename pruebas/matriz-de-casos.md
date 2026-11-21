# Matriz de casos esperados

Qué debe ver una persona en cada situación y qué módulo es **responsable** del resultado. La
columna **Verificación** indica la prueba automática (`npm test`; el código del caso aparece en el
nombre de la prueba), la prueba en los tres navegadores (`npm run test:navegadores`, carpeta
`navegadores/`) o un recorrido a mano con el panel «Probar el servidor simulado» del pie de página.

## Recorridos de una consulta

Siguiendo la sugerencia de la revisión de la Semana 4, primero se describe qué debería ver una
persona al abrir un destino, que consulta la API REST (la ficha) y la GraphQL (vuelos y hoteles):

| Situación | Qué ve la persona | Verificación |
|---|---|---|
| Respuesta exitosa | Esqueleto con la forma de las tarjetas, «Cargando vuelos…» y la barra bajo la cabecera; luego la ficha, «3 vuelos de ida y vuelta» y los hoteles, sin que la página salte | Q1, C1, navegadores |
| Demora (modo «Red lenta», 3 s) | Lo mismo durante los 3 segundos; el botón dice «Actualizando…» y no acepta otro clic | Q1, recorrido a mano |
| Fallo HTTP (modo «Error del servidor») | Un aviso por cada API que falló, con su fuente («Ficha del destino · API REST», «Vuelos y hoteles · API GraphQL»), el código 500 y «Reintentar» | E2, E8, Q4, navegadores |
| Fallo de red (modo «Sin conexión») | Aviso «Sin conexión con el servidor», distinto del error HTTP, con «Reintentar» | E3, E9 |
| Sin respuesta (modo «Sin respuesta») | El esqueleto hasta los 8 segundos y luego «El servidor tarda demasiado» con «Reintentar» | E4 |
| Reintentar | El aviso desaparece, vuelve el estado de carga y luego los datos | Q4, C2, navegadores |
| Salir de la vista durante la espera | La petición se cancela; no aparece ningún error ni queda el indicador encendido | Q3, O3, E6 |
| Cambiar de destino durante la espera | Solo se muestran los datos del destino vigente: la respuesta tardía del anterior no los reemplaza ni apaga el indicador antes de tiempo | Q2 |
| Volver a un destino ya consultado | Los datos aparecen al instante, sin petición nueva | Q5, G5, O1 |

## API REST de destinos — `mocks/handlers.js`, `api/cliente.js`

| N° | Caso | Resultado esperado | Responsable | Verificación |
|---|---|---|---|---|
| R1 | `GET /api/destinos` | 9 destinos con país, región y actividades populares | `handlers` | `rest.test.js` |
| R2 | `GET /api/destinos/lisboa` | Ficha completa (descripción, idioma, moneda, mejor época) | `handlers` | `rest.test.js` |
| R3 | Consulta antes de que el mock esté listo | Espera y luego responde | `esperarServidor` | `rest.test.js` |
| R4 | Cualquier petición | El indicador suma al empezar y resta al terminar | `pedir` + `actividad.js` | `rest.test.js` |

## API GraphQL de vuelos y hoteles — `mocks/esquema.js`, `graphql/`

| N° | Caso | Resultado esperado | Responsable | Verificación |
|---|---|---|---|---|
| G1 | `query OpcionesDeViaje(cusco)` | Una sola petición trae 3 vuelos y 3 hoteles con precio, fechas y disponibilidad | esquema + Apollo | `graphql.test.js` |
| G2 | Consulta con dos campos | El servidor responde solo esos campos | `ejecutar` | `graphql.test.js` |
| G3 | Consulta con un campo que no existe | El esquema la rechaza | `ESQUEMA` | `graphql.test.js` |
| G4 | Destino inexistente | Error GraphQL `NOT_FOUND` → «No encontramos lo que buscas» | resolvers + `aErrorApi` | `graphql.test.js` |
| G5 | Repetir la consulta | Responde la caché de Apollo, sin ir al servidor | `InMemoryCache` | `graphql.test.js` |
| G6 | `mutation Reservar` | Código de reserva; descuenta asientos y habitaciones y la caché ve la disponibilidad nueva | resolvers + caché | `graphql.test.js` |
| G7 | Reservar sin asientos suficientes | Error `SIN_DISPONIBILIDAD`; no descuenta nada | `reservar` | `graphql.test.js` |
| G8 | Hotel que no cubre las fechas del vuelo | Error `SIN_DISPONIBILIDAD` | `reservar` | `graphql.test.js` |

## Errores — `api/cliente.js`, `graphql/errores.js`, `componentes/MensajeError.jsx`

| N° | Caso | Resultado esperado | Responsable | Verificación |
|---|---|---|---|---|
| E1 | `GET /api/destinos/marte` | 404 → `no-encontrado`, sin «Reintentar», con salida a los destinos | `pedirJSON` | `rest.test.js` |
| E2 | REST con el servidor en error | 500 → `servidor` | `pedirJSON` | `rest.test.js` |
| E3 | REST sin conexión | `red`, sin código HTTP | `pedir` | `rest.test.js` |
| E4 | Servidor sin respuesta | Se corta a los 8 s → `tiempo`; el indicador se apaga | `pedir` | `rest.test.js` |
| E5 | Respuesta que no es JSON | `respuesta` | `pedirJSON` | `rest.test.js` |
| E6 | La página cancela la petición | `AbortError`, no se muestra como falla | `pedir` | `rest.test.js` |
| E7 | El mock no arranca | Error de red sin pedir a la red real | `esperarServidor` | `rest.test.js` |
| E8 | GraphQL con el servidor en error | `ServerError` 500 → `servidor` (error HTTP) | `aErrorApi` | `graphql.test.js` |
| E9 | GraphQL sin conexión | `red`, distinto del error HTTP | `pedir` + `aErrorApi` | `graphql.test.js` |

## Estados de las consultas — `hooks/useConsulta.js`, `hooks/useOpcionesDeViaje.js`

| N° | Caso | Resultado esperado | Responsable | Verificación |
|---|---|---|---|---|
| C1–C7 | REST: primera carga, error y reintento, actualizar, respaldo, caché compartida, caché vaciada | Ver `useConsulta.test.jsx` | `useConsulta` | `useConsulta.test.jsx` |
| Q1–Q5 | GraphQL: espera, cambio de destino, salir durante la espera, fallo y reintento, volver | Ver la tabla de recorridos | `useOpcionesDeViaje` | `useOpcionesDeViaje.test.jsx` |
| O1–O7 | Caché REST: vigencia, petición compartida, cancelación, respaldo, avisos, modo estricto | Una sola petición por recurso | `api/cache.js` | `cache.test.js` |

## Reglas y plan del viaje — `utilidades/viaje.js`, `plan/plan.js`

| N° | Caso | Resultado esperado | Responsable | Verificación |
|---|---|---|---|---|
| V1 | Noches y habitaciones | Noches entre ida y vuelta; una habitación doble cada dos pasajeros | `nochesDe`, `habitacionesPara` | `viaje.test.js` |
| V2 | Total | Vuelos por pasajero + hotel por noche y habitación | `calcularTotal` | `viaje.test.js` |
| V3 | Vuelo agotado o con pocos asientos | Botón deshabilitado y el motivo a la vista | `motivoVuelo` | `viaje.test.js` |
| V4 | Hotel sin cupo o fuera de las fechas del vuelo | Botón deshabilitado y el motivo | `motivoHotel` | `viaje.test.js` |
| V5 | Filtro por región | Regiones tomadas de la respuesta; filtrar no modifica la lista | `regionesDe`, `filtrarPorRegion` | `viaje.test.js` |
| P1 | Elegir vuelo y hotel | Plan completo y «Revisar y reservar» | `elegir` | `viaje.test.js` |
| P2 | Elegir en otro destino | El plan se reemplaza, se conservan los pasajeros y se avisa | `elegir` | `viaje.test.js` |
| P3 | Quitar la última opción | Plan sin destino | `quitar` | `viaje.test.js` |
| P4 | Pasajeros | Entre 1 y 6 | `cambiarPasajeros` | `viaje.test.js` |
| P5 | Plan guardado dañado | Se descarta y se parte de cero | `leerPlan` | `viaje.test.js` |

## Navegación — `rutas/AppRoutes.jsx`, `rutas/paginasPublicadas.js`

| N° | Caso | Resultado esperado | Responsable | Verificación |
|---|---|---|---|---|
| N1 | `/` y `/mi-viaje` | Destinos y Mi viaje | `AppRoutes` | `rutas.test.jsx` |
| N2 | `/destinos/cusco` | Ruta dinámica con `id = cusco` | `AppRoutes` | `rutas.test.jsx` |
| N3 | `/vuelos`, `/destinos`, `/destinos/cusco/extra` | Página no encontrada | `AppRoutes` | `rutas.test.jsx` |
| N4 | Páginas publicadas | Una por ruta fija y por destino del mock | `paginasPublicadas.js` | `rutas.test.jsx` |

## En los navegadores — `navegadores/`

| N° | Caso | Resultado esperado | Verificación |
|---|---|---|---|
| X1 | Recorrido completo: filtrar por región, abrir un destino, elegir vuelo y hotel, reservar | Código de reserva y plan vacío | Chromium, Firefox y WebKit |
| X2 | Error del servidor en un destino y reintento | Avisos con su fuente; al reintentar, los datos | Chromium, Firefox y WebKit |
| X3 | Recargar una ruta publicada y abrir una inexistente | La misma página, y el 404 de la aplicación | Chromium, Firefox y WebKit |
| X4 | Teléfono (390 px) | Sin desborde horizontal; el resumen del viaje debajo de las opciones | Chromium, Firefox y WebKit |

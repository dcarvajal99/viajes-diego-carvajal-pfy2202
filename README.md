# Rumbo Austral — Semana 5

> **Sitio publicado:** https://dcarvajal99.github.io/viajes-diego-carvajal-pfy2202/
> **Repositorio:** https://github.com/dcarvajal99/viajes-diego-carvajal-pfy2202

Actividad sumativa «Integrando nuestro frontend con backend» de la asignatura **Desarrollo
Frontend II (PFY2202)**, Duoc UC. Exp 2 — Semana 5.

Agencia de viajes ficticia que vende viajes desde Santiago, construida con **React 19**,
**React Router 7**, **Tailwind CSS 4** y **Vite**. Las personas exploran los destinos, eligen uno y
ven sus vuelos y hoteles para armar el viaje completo y reservarlo. El backend es simulado con
**Mock Service Worker (MSW)** y entrega los datos por dos vías:

- **API REST**: los destinos, con su país y sus actividades populares.
- **API GraphQL**, consumida con **Apollo Client**: los vuelos y hoteles de cada destino, con
  precios, fechas y disponibilidad, y la reserva como mutación.

---

## Observaciones de la revisión de la Semana 4

La revisión pidió fortalecer la integración con el servicio simulado. Así se resolvió en esta entrega:

| Observación | Cómo se resolvió |
|---|---|
| Integrar un servicio REST simulado con MSW, disponible antes de la primera consulta | MSW responde la API REST y la GraphQL. Las consultas esperan a que su Service Worker esté listo (`esperarServidor`), con el mismo tiempo máximo de 8 segundos |
| Generar el listado con los datos que devuelve el servicio | Los destinos, y también las regiones del filtro, salen de la respuesta de `GET /api/destinos`; no hay arreglos fijos en la interfaz |
| Vincular el indicador de carga al inicio y término de cada petición | `pedir()` suma y resta en `api/actividad.js` en cada petición, REST o GraphQL, termine bien o mal. Cada vista tiene además su propio esqueleto y una línea de estado |
| Comunicar los errores HTTP y de red y ofrecer un reintento | Se distinguen la falla de red, el tiempo agotado, el error HTTP (con su código) y el error de la consulta GraphQL. Cada aviso dice qué API falló y ofrece «Reintentar» cuando sirve |
| Evitar consultas repetidas y proteger la vista de respuestas desactualizadas | Caché REST propia y caché de Apollo; una sola petición por recurso. Al cambiar de destino durante la espera, la respuesta tardía del anterior no reemplaza la vista; al salir, la petición se cancela |
| Describir qué ve la persona con éxito, demora, fallo, reintento y al salir durante la espera | Tabla de recorridos en [`pruebas/matriz-de-casos.md`](pruebas/matriz-de-casos.md), cada uno con su prueba automática |

## Rutas del sitio

| Ruta | Página | Qué muestra | API |
|---|---|---|---|
| `/` | Destinos | Los 9 destinos con país, región y actividades populares; filtro por región (`?region=`) | REST `GET /api/destinos` |
| `/destinos/:id` | Destino | Ficha del destino; vuelos y hoteles para elegir; resumen del viaje con el total | REST `GET /api/destinos/:id` y GraphQL `OpcionesDeViaje` |
| `/mi-viaje` | Mi viaje | Resumen del viaje y «Confirmar reserva» | GraphQL `OpcionesDeViaje` y `mutation Reservar` |
| cualquier otra | Página no encontrada | Aviso con la dirección pedida y enlaces para volver | — |

## Qué pide la actividad y cómo se resolvió

| Pide la actividad | Cómo se resolvió |
|---|---|
| Agencia de viajes con HTML, JavaScript, CSS y React para explorar vuelos y hoteles | Rumbo Austral: React 19 con Vite y Tailwind CSS 4 |
| API REST mock con los destinos, su país y sus actividades populares | `GET /api/destinos` y `GET /api/destinos/:id` con MSW (`mocks/handlers.js`) |
| API GraphQL mock para los vuelos y hoteles de cada destino, con precios, fechas y disponibilidad | Esquema GraphQL real (`mocks/esquema.js`) ejecutado dentro de MSW; Apollo Client con `useQuery` y `useMutation` |
| Elegir un destino y ver sus vuelos y hoteles para planificar el viaje | Vuelos de ida y vuelta y hoteles del destino; al elegir un vuelo, los hoteles se revisan para sus fechas; el resumen calcula noches, habitaciones y total; la reserva descuenta la disponibilidad |
| Navegación con React Router | Rutas centralizadas con carga diferida, ruta de diseño con `Outlet`, ruta dinámica `destinos/:id`, ruta `*`, `Link`, `NavLink`, `useParams`, `useSearchParams`, `useMatch` y `useNavigate` |
| Estado con `useState` y `useEffect` | El viaje en armado vive en `PlanProvider` (`useState`) y `useEffect` lo guarda en el navegador; filtros, orden y avisos son estado local; las consultas se lanzan desde efectos |
| Repositorio `viajes-nombre-apellido-siglaCurso` en GitHub, con gh-pages | Este repositorio, publicado en GitHub Pages |
| Probar en distintos navegadores | Pruebas automáticas del recorrido en Chromium y Firefox, contra la versión local y la publicada (ver más abajo) |

## Las dos APIs

### REST — `mocks/handlers.js`, `api/cliente.js`, `hooks/useConsulta.js`

| Petición | Respuesta |
|---|---|
| `GET /api/destinos` | 200 con `{ id, nombre, pais, region, actividades }` de cada destino |
| `GET /api/destinos/:id` | 200 con la ficha completa (descripción, mejor época, idioma, moneda). 404 con `{ mensaje }` si no existe |

### GraphQL — `mocks/esquema.js`, `graphql/`, `hooks/useOpcionesDeViaje.js`

```graphql
type Query {
  vuelos(destinoId: ID!): [Vuelo!]!   # ida y vuelta desde Santiago: fechas, escalas, precio y asientos libres
  hoteles(destinoId: ID!): [Hotel!]!  # precio por noche, fechas en que recibe huéspedes y habitaciones libres
}
type Mutation {
  reservar(vueloId: ID!, hotelId: ID!, pasajeros: Int!): Reserva!
}
```

- **Un esquema real.** El handler de MSW ejecuta cada operación con la librería `graphql`: responde solo
  los campos pedidos, rechaza las consultas mal escritas y devuelve errores con un código
  (`NOT_FOUND`, `SIN_DISPONIBILIDAD`).
- **Una sola petición** (`query OpcionesDeViaje`) trae los vuelos y los hoteles del destino.
- **La reserva actualiza la caché.** La mutación devuelve la disponibilidad nueva del vuelo y del hotel;
  Apollo la guarda por tipo e id y las listas se actualizan solas, sin volver a consultarlas.
- **Tres familias de error.** Apollo distingue el error de red, el HTTP (`ServerError`, con su código)
  y el de la consulta (`CombinedGraphQLErrors`); `graphql/errores.js` los traduce al mismo `ErrorApi`
  de la API REST, así `MensajeError` los explica igual.

### Panel «Probar el servidor simulado»

En el pie de cada página se elige cómo responden las dos APIs: normal (400 ms), red lenta (3 s),
error del servidor (500), sin conexión o sin respuesta (el cliente se rinde a los 8 segundos).

## Organización del código

```
src/
├── main.jsx                 Inicia el mock y dibuja la aplicación al mismo tiempo
├── App.jsx                  BrowserRouter, ApolloProvider y PlanProvider
├── rutas/                   AppRoutes.jsx (rutas con carga diferida) y paginasPublicadas.js
├── mocks/                   datos.js, handlers.js (REST y GraphQL), esquema.js, simulacion.js, browser.js
├── api/                     cliente.js (pedir y pedirJSON), cache.js, actividad.js, destinos.js
├── graphql/                 cliente.js (Apollo), operaciones.js (consultas y mutación), errores.js
├── plan/                    plan.js (funciones puras), PlanContext.js y PlanProvider.jsx
├── hooks/                   useConsulta, useOpcionesDeViaje, useExterno y useTituloPagina
├── paginas/                 Destinos, Destino, MiViaje y NoEncontrada
├── componentes/             Plantilla, Cabecera, TarjetaDestino, TarjetaOpcion, TarjetaVuelo,
│                            TarjetaHotel, ResumenViaje, Cargando, MensajeError, GrupoOpciones,
│                            SelectorCantidad, Etiquetas, BotonActualizar, PanelPruebas...
└── utilidades/              viaje.js (reglas: noches, habitaciones, disponibilidad y total),
                             destinos.js, formato.js y estilos.js
pruebas/                     Pruebas con Vitest y matriz-de-casos.md
navegadores/                 Pruebas del recorrido con Playwright
capturas/                    Evidencias de la entrega
```

- **Reglas en un solo lugar.** `utilidades/viaje.js` decide noches, habitaciones, disponibilidad y
  total; lo usan las tarjetas, el resumen y también el servidor simulado al validar una reserva.
- **Componentes reutilizables.** `TarjetaOpcion` es la base de `TarjetaVuelo` y `TarjetaHotel`;
  `ResumenViaje` se usa en el destino y en Mi viaje; `MensajeError`, `Cargando`, `GrupoOpciones`,
  `SelectorCantidad` y `Etiquetas` se repiten en varias vistas.
- **Carga sin saltos.** Cada esqueleto repite la forma de lo que viene (tarjetas, ficha, filas de
  opciones) y las líneas de estado y botones reservan su lugar desde el inicio.

## Pruebas

`npm test` corre **54 pruebas** con Vitest; la [matriz de casos](pruebas/matriz-de-casos.md) las
relaciona con lo que debe ver la persona:

| Archivo | Qué prueba |
|---|---|
| `rest.test.js` | API REST contra los mismos handlers de MSW en Node: respuestas, 404, 500, red, tiempo, cancelación y espera al mock |
| `graphql.test.js` | Apollo contra la API GraphQL: consulta, selección de campos, validación, caché, mutación y errores HTTP y de red |
| `useOpcionesDeViaje.test.jsx` | La consulta GraphQL dentro de un componente: espera, cambio de destino durante la espera, salir de la vista, fallo y reintento, volver |
| `useConsulta.test.jsx`, `cache.test.js` | Estados y caché de la API REST |
| `viaje.test.js` | Reglas del viaje y plan en armado, incluida la lectura de lo guardado |
| `rutas.test.jsx` | Qué ruta atiende cada dirección y que las páginas publicadas coincidan |

### En distintos navegadores

`npm run test:navegadores` recorre el sitio con **Playwright** en **Chromium** (Chrome y Edge) y
**Firefox**: filtrar por región, abrir un destino, elegir vuelo y hotel y reservar; error del
servidor y reintento; recargar una ruta publicada y abrir una inexistente; y la vista de teléfono
sin desborde. Con `SITIO=https://dcarvajal99.github.io/viajes-diego-carvajal-pfy2202/` las mismas
pruebas corren contra el sitio publicado: pasan las 8 en los dos navegadores.

- **Error encontrado en Firefox.** Al recargar justo cuando el Service Worker de MSW se está
  instalando (el primer segundo de la primera visita), Firefox a veces deja colgada la carga y el
  sitio quedaba en «Cargando…» para siempre. No se puede evitar desde la aplicación, pero ya no queda
  sin salida: la espera al servidor simulado tiene tiempo máximo y termina en un aviso, y si el código
  de una página tarda más de lo normal se ofrece «Recargar la página». Con un backend real no ocurre.
- **WebKit (Safari).** Se puede agregar con `CON_WEBKIT=1`. En el equipo de desarrollo (macOS 26.0)
  el WebKit 27.2 de Playwright se cierra al abrir cualquier página, incluso `about:blank`, así que
  quedó fuera de la corrida automática.

## Cómo ejecutarlo

Requiere Node.js 20.19 o superior.

```bash
npm install
npm run dev        # abre http://localhost:5173/viajes-diego-carvajal-pfy2202/
```

Otros comandos:

```bash
npm run build              # deja la versión publicable en dist/ (una página por ruta y 404.html)
npm run preview            # sirve dist/ en http://localhost:4173/viajes-diego-carvajal-pfy2202/
npm run lint               # revisa el código con oxlint
npm test                   # 54 pruebas de Vitest
npx playwright install chromium firefox   # una vez, para las pruebas de navegadores
npm run test:navegadores   # recorrido en Chromium y Firefox
npm run deploy             # construye y publica dist/ en la rama gh-pages
```

## Verificación

- W3C Nu HTML Checker: 0 errores y 0 advertencias en el DOM publicado en 10 estados: destinos,
  destinos filtrados, destino, destino inexistente, Mi viaje vacío y con viaje, reserva confirmada,
  error 500, carga en modo lento y página no encontrada.
- Lighthouse sobre el sitio publicado: 100 en accesibilidad, buenas prácticas y SEO en Destinos, un
  destino y Mi viaje, en escritorio y teléfono.
- `npm test`: 54 pruebas de Vitest pasan. `oxlint` sin avisos y `npm audit` sin vulnerabilidades.
- Playwright: 8 de 8 en Chromium y Firefox, contra la versión local y contra GitHub Pages.
- GitHub Pages responde 200 en las 11 páginas publicadas (inicio, Mi viaje y los 9 destinos) y 404
  con la aplicación en cualquier otra dirección.

## Capturas

Tomadas del sitio publicado, en `capturas/` (escritorio a 1280 px y teléfono a 390 px):

| Archivo | Qué muestra |
|---|---|
| `01-destinos.png` | Los 9 destinos de la API REST con el filtro por región |
| `02-destinos-region.png` | Filtro «Sudamérica» en la URL |
| `03-cargando-destino.png` | Modo «Red lenta»: esqueletos, «Cargando vuelos…» y la barra bajo la cabecera |
| `04-destino.png` | Cusco: ficha (REST), vuelos (GraphQL) y el resumen del viaje con el total |
| `05-opciones-elegidas.png` | Vuelo y hotel elegidos; un hotel bloqueado por no cubrir las fechas del vuelo |
| `06-mi-viaje.png` | Resumen antes de confirmar |
| `07-reserva-confirmada.png` | Mutación `reservar`: código de reserva y total |
| `08-error-servidor.png` | Error 500 en las dos APIs, cada aviso con su fuente y «Reintentar» |
| `09-sin-conexion.png` | Falla de red, distinta del error HTTP |
| `10-destino-no-existe.png` | 404 de un destino |
| `11-movil-destinos.png`, `12-movil-destino.png` | Destinos y vuelos en el teléfono |

## Autor

Diego Carvajal — Desarrollo Frontend II (PFY2202), Duoc UC.

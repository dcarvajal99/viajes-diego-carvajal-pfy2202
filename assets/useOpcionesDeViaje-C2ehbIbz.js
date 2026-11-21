import{$ as e,F as t,G as n,H as r,I as i,J as a,K as o,L as s,R as c,S as l,U as u,V as d,W as f,Y as p,at as ee,b as te,it as m,k as ne,l as h,nt as g,ot as _,p as v,q as y,rt as b,t as x,tt as S,v as re,x as ie,z as ae}from"./index-DxIr_8el.js";import{i as oe,r as C,s as w}from"./useConsulta-DL0Jui_n.js";var T=_(ee(),1);function E(e){let t=T.useContext(g()),n=e||t.client;return b(!!n,30),n}var se=1,D,O={};function k(e){return e in O&&(delete O[e],!0)}var A={setImmediate:function(e){var t=se++;return O[t]=!0,D||=Promise.resolve(),D.then(function(){return k(t)&&e()}),t},clearImmediate:function(e){k(e)}},j=A.setImmediate,M=A.clearImmediate,N={setImmediate:function(){var e=[...arguments];return(N.delegate?.setImmediate||j).apply(void 0,p([],a(e)))},clearImmediate:function(e){return(N.delegate?.clearImmediate||M)(e)},delegate:void 0},ce=function(e){y(t,e);function t(t,n){var r=e.call(this,t,n)||this;return r.scheduler=t,r.work=n,r}return t.prototype.requestAsyncId=function(t,n,r){return r===void 0&&(r=0),r!==null&&r>0?e.prototype.requestAsyncId.call(this,t,n,r):(t.actions.push(this),t._scheduled||=N.setImmediate(t.flush.bind(t,void 0)))},t.prototype.recycleAsyncId=function(t,n,r){if(r===void 0&&(r=0),r==null?this.delay>0:r>0)return e.prototype.recycleAsyncId.call(this,t,n,r);var i=t.actions;n!=null&&i[i.length-1]?.id!==n&&(N.clearImmediate(n),t._scheduled===n&&(t._scheduled=void 0))},t}(n),le=new(function(e){y(t,e);function t(){return e!==null&&e.apply(this,arguments)||this}return t.prototype.flush=function(e){this._active=!0;var t=this._scheduled;this._scheduled=void 0;var n=this.actions,r;e||=n.shift();do if(r=e.execute(e.state,e.delay))break;while((e=n[0])&&e.id===t&&n.shift());if(this._active=!1,r){for(;(e=n[0])&&e.id===t&&n.shift();)e.unsubscribe();throw r}},t}(f))(ce),P=typeof m(()=>window.document.createElement)==`function`,F=new Map,I=new Map,L=!0,R=!1;function z(e){return e.replace(/[\s,]+/g,` `).trim()}function B(e){return z(e.source.body.substring(e.start,e.end))}function V(e){var t=new Set,n=[];return e.definitions.forEach(function(e){if(e.kind===`FragmentDefinition`){var r=e.name.value,i=B(e.loc),a=I.get(r);a&&!a.has(i)?L&&console.warn(`Warning: fragment with name `+r+` already exists.
graphql-tag enforces all fragment names across your application to be unique; read more about
this in the docs: http://dev.apollodata.com/core/fragments.html#unique-names`):a||I.set(r,a=new Set),a.add(i),t.has(i)||(t.add(i),n.push(e))}else n.push(e)}),o(o({},e),{definitions:n})}function H(e){var t=new Set(e.definitions);t.forEach(function(e){e.loc&&delete e.loc,Object.keys(e).forEach(function(n){var r=e[n];r&&typeof r==`object`&&t.add(r)})});var n=e.loc;return n&&(delete n.startToken,delete n.endToken),e}function U(t){var n=z(t);if(!F.has(n)){var r=e(t,{experimentalFragmentVariables:R,allowLegacyFragmentVariables:R,experimentalFragmentArguments:R});if(!r||r.kind!==`Document`)throw Error(`Not a valid GraphQL document.`);F.set(n,H(V(r)))}return F.get(n)}function W(e){var t=[...arguments].slice(1);typeof e==`string`&&(e=[e]);var n=e[0];return t.forEach(function(t,r){t&&t.kind===`Document`?n+=t.loc.source.body:n+=t,n+=e[r+1]}),U(n)}function ue(){F.clear(),I.clear()}function de(){L=!1}function fe(){R=!0}function pe(){R=!1}var G={gql:W,resetCaches:ue,disableFragmentWarnings:de,enableExperimentalFragmentVariables:fe,disableExperimentalFragmentVariables:pe};(function(e){e.gql=G.gql,e.resetCaches=G.resetCaches,e.disableFragmentWarnings=G.disableFragmentWarnings,e.enableExperimentalFragmentVariables=G.enableExperimentalFragmentVariables,e.disableExperimentalFragmentVariables=G.disableExperimentalFragmentVariables})(W||={}),W.default=W;function K(e,t){let n=T.useRef(void 0);return n.current&&S(n.current.deps,t)||(n.current={value:e(),deps:t}),n.current.value}var me=Symbol.for(`apollo.skipToken`),he=Symbol.for(`apollo.hook.wrappers`);function ge(e,t,n){let r=[n.queryManager,e.startsWith(`use`)?T.useContext(g()):void 0],i=t;for(let t of r){let n=t?.[he]?.[e];n&&(i=n(i))}return i}var _e=T.useSyncExternalStore,ve=m(()=>navigator.product)==`ReactNative`,ye=m(()=>navigator.userAgent.indexOf(`jsdom`)>=0)||!1,be=(P||ve)&&!ye,xe=_e||((e,t,n)=>{let r=t(),[{inst:i},a]=T.useState({inst:{value:r,getSnapshot:t}});return be?T.useLayoutEffect(()=>{Object.assign(i,{value:r,getSnapshot:t}),q(i)&&a({inst:i})},[e,r,t]):Object.assign(i,{value:r,getSnapshot:t}),T.useEffect(()=>(q(i)&&a({inst:i}),e(function(){q(i)&&a({inst:i})})),[e]),r});function q({value:e,getSnapshot:t}){try{return e!==t()}catch{return!0}}var J=Symbol(),Y=function(e,...[t]){"use no memo";return ge(`useQuery`,Se,E(typeof t==`object`?t.client:void 0))(e,t)};function Se(e,t={}){let n=E(typeof t==`object`?t.client:void 0),{ssr:r}=typeof t==`object`?t:{},i=Ce(e,t,n.defaultOptions.watchQuery);function a(t){let r=n.watchQuery(i);return{client:n,query:e,observable:r,resultData:{current:r.getCurrentResult(),previousData:t?.resultData.current.data,variables:r.variables}}}let[o,s]=T.useState(a);(n!==o.client||e!==o.query)&&s(o=a(o));let{observable:c,resultData:l}=o;we(i,c),Ee(l,c,i);let u=Te(c,l,r),d=T.useMemo(()=>({refetch:c.refetch.bind(c),fetchMore:c.fetchMore.bind(c),updateQuery:c.updateQuery.bind(c),startPolling:c.startPolling.bind(c),stopPolling:c.stopPolling.bind(c),subscribeToMore:c.subscribeToMore.bind(c)}),[c]),f=l.previousData;return T.useMemo(()=>{let{partial:e,...t}=u;return{...t,client:n,observable:c,variables:c.variables,previousData:f,...d}},[u,n,c,f,d])}var X=Symbol();function Ce(e,t,n){return K(()=>{if(t===me){let t={...d(n,{query:e,fetchPolicy:`standby`}),[ae]:!0};return t[X]=!0,t}let r=d(n,{...t,query:e});return t.skip&&(r.initialFetchPolicy=t.initialFetchPolicy||t.fetchPolicy,r.fetchPolicy=`standby`),r},[e,t,n])}function we(e,t){"use no memo";e.fetchPolicy||=t.options.initialFetchPolicy}function Te(e,t,n){"use no memo";let r=e.options.fetchPolicy;return xe(T.useCallback(n=>{let r=e.pipe(u(le)).subscribe(r=>{let i=t.current;S(i,r)&&S(t.variables,e.variables)||(t.variables=e.variables,i.data&&!S(i.data,r.data)&&(t.previousData=i.data),t.current=r,n())});return()=>{setTimeout(()=>r.unsubscribe())}},[e,t]),()=>t.current,()=>r!==`standby`&&n===!1||r===`no-cache`?Y.ssrDisabledResult:t.current)}function Ee(e,t,n){"use no memo";if(t[J]&&!S(t[J],n)){t[J][X]&&!n.initialFetchPolicy&&(n.initialFetchPolicy=n.fetchPolicy),De(t[J],n)?t.reobserve(n):t.applyOptions(n);let r=t.getCurrentResult();S(r.data,e.current.data)||(e.previousData=e.current.data||e.previousData),e.current=r,e.variables=t.variables}t[J]=n}function De(e,t){return e.query!==t.query||!S(e.variables,t.variables)||e.fetchPolicy!==t.fetchPolicy&&(t.fetchPolicy===`standby`||e.fetchPolicy===`standby`)}Y.ssrDisabledResult=r({loading:!0,data:void 0,dataState:`empty`,error:void 0,networkStatus:t.loading,partial:!0});var Z=re();function Oe({cantidad:e,nombre:t,puedeRestar:n,puedeSumar:r,onRestar:i,onSumar:a}){return(0,Z.jsxs)(`div`,{className:`inline-flex items-center gap-1.5`,role:`group`,"aria-label":`Cantidad de `+t,children:[(0,Z.jsx)(h,{tamano:`icono`,"aria-label":`Quitar uno: `+t,"aria-disabled":!n,onClick:()=>n&&i(),children:`−`}),(0,Z.jsx)(`span`,{className:`min-w-10 text-center font-semibold tabular-nums`,children:e}),(0,Z.jsx)(h,{tamano:`icono`,"aria-label":`Agregar uno: `+t,"aria-disabled":!r,onClick:()=>r&&a(),children:`+`})]})}function Q({etiqueta:e,valor:t,fuerte:n=!1}){return(0,Z.jsxs)(`div`,{className:`flex justify-between gap-3 `+(n?`border-t border-borde pt-2 text-base font-semibold`:``),children:[(0,Z.jsx)(`dt`,{children:e}),(0,Z.jsx)(`dd`,{className:`tabular-nums`,children:t})]})}function ke({titulo:e,vuelo:t,hotel:n,children:r}){let{plan:i,cambiarPasajeros:a}=ne(),o=t?l({vuelo:t,hotel:n,pasajeros:i.pasajeros}):null;return(0,Z.jsxs)(`section`,{className:v+` space-y-4`,"aria-labelledby":`titulo-resumen`,children:[(0,Z.jsx)(`h2`,{id:`titulo-resumen`,className:`text-lg font-semibold`,children:e}),(0,Z.jsxs)(`div`,{className:`flex items-center justify-between gap-3`,children:[(0,Z.jsx)(`span`,{id:`etiqueta-pasajeros`,className:`text-sm font-medium`,children:`Pasajeros`}),(0,Z.jsx)(Oe,{cantidad:i.pasajeros,nombre:`pasajeros`,puedeRestar:te(i),puedeSumar:ie(i),onRestar:()=>a(-1),onSumar:()=>a(1)})]}),(0,Z.jsxs)(`div`,{className:`space-y-2 text-sm`,children:[(0,Z.jsxs)(`p`,{children:[(0,Z.jsx)(`span`,{className:`font-medium`,children:`Vuelo: `}),t?t.aerolinea+` `+t.numero+`, `+oe(t.ida):(0,Z.jsx)(`span`,{className:`text-suave`,children:`todavía no eliges uno`})]}),(0,Z.jsxs)(`p`,{children:[(0,Z.jsx)(`span`,{className:`font-medium`,children:`Hotel: `}),n?n.nombre:(0,Z.jsx)(`span`,{className:`text-suave`,children:`todavía no eliges uno`})]})]}),o&&(0,Z.jsxs)(`dl`,{className:`space-y-1 text-sm`,children:[(0,Z.jsx)(Q,{etiqueta:`Vuelos (`+C(i.pasajeros,`pasajero`,`pasajeros`)+`)`,valor:w(o.vuelos)}),n&&(0,Z.jsx)(Q,{etiqueta:`Hotel (`+C(o.noches,`noche`,`noches`)+`, `+C(o.habitaciones,`habitación`,`habitaciones`)+`)`,valor:w(o.alojamiento)}),(0,Z.jsx)(Q,{etiqueta:`Total`,valor:w(o.total),fuerte:!0})]}),r]})}var Ae={NOT_FOUND:`no-encontrado`,SIN_DISPONIBILIDAD:`sin-disponibilidad`};function $(e){if(!e)return null;if(e instanceof x)return e;if(s.is(e)){let t=e.statusCode;return t===404?new x(`no-encontrado`,`El servicio GraphQL no existe.`,t):t>=500?new x(`servidor`,`El servidor respondió con un error (`+t+`).`,t):new x(`respuesta`,`El servidor rechazó la consulta (`+t+`).`,t)}if(i.is(e))return new x(`respuesta`,`El servidor envió datos que no se pueden leer.`);if(c.is(e)){let[t]=e.errors,n=Ae[t?.extensions?.code]??`consulta`;return new x(n,t?.message??`La consulta no se pudo completar.`)}return new x(`red`,`No se pudo conectar con el servidor.`)}var je=W`
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
`,Me=W`
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
`,Ne=W`
  query OpcionesDeViaje($destinoId: ID!) {
    vuelos(destinoId: $destinoId) {
      ...CamposVuelo
    }
    hoteles(destinoId: $destinoId) {
      ...CamposHotel
    }
  }
  ${je}
  ${Me}
`,Pe=W`
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
`;function Fe(e){let{data:t,loading:n,error:r,refetch:i}=Y(Ne,{variables:{destinoId:e},skip:!e}),a=$(r);return{vuelos:t?.vuelos??null,hoteles:t?.hoteles??null,cargando:n,error:a,respaldo:!!(a&&t),recargar:()=>i().catch(()=>{})}}export{P as a,ke as i,Pe as n,E as o,$ as r,Fe as t};
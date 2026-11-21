// Cliente de Apollo para la API GraphQL. Usa `pedir` como su fetch, así las peticiones GraphQL
// esperan al servidor simulado, tienen el mismo tiempo máximo y mueven el mismo indicador de
// actividad que las REST. La caché de Apollo (InMemoryCache) guarda cada vuelo y hotel por su
// tipo e id: una consulta ya respondida no se repite y una reserva actualiza las listas.
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { pedir, urlGraphQL } from '../api/cliente.js';

export function crearClienteGraphQL(uri = urlGraphQL()) {
    return new ApolloClient({
        link: new HttpLink({ uri, fetch: (url, opciones) => pedir(url, opciones) }),
        cache: new InMemoryCache(),
    });
}

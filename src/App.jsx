// Componente raíz: arma los proveedores que usa toda la aplicación.
//   - BrowserRouter: cualquier componente puede leer la URL y navegar. En GitHub Pages el sitio
//     vive en una subcarpeta: basename le indica que las rutas empiezan después de ella.
//   - ApolloProvider: entrega el cliente de la API GraphQL a useQuery y useMutation.
//   - PlanProvider: el viaje en armado (destino, vuelo, hotel y pasajeros).
import { ApolloProvider } from '@apollo/client/react';
import { BrowserRouter } from 'react-router';
import PlanProvider from './plan/PlanProvider.jsx';
import AppRoutes from './rutas/AppRoutes.jsx';

function App({ clienteGraphQL }) {
    return (
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <ApolloProvider client={clienteGraphQL}>
                <PlanProvider>
                    <AppRoutes />
                </PlanProvider>
            </ApolloProvider>
        </BrowserRouter>
    );
}

export default App;

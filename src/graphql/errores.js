// Traduce un error de Apollo al mismo ErrorApi que usa la API REST, para que MensajeError lo
// explique igual. Apollo distingue tres familias y aquí se respetan:
//   - Error de red o de tiempo: lo lanza `pedir` (api/cliente.js) y llega tal cual.
//   - Error HTTP (ServerError): el servidor respondió con un código 4xx o 5xx.
//   - Error GraphQL (CombinedGraphQLErrors): el servidor respondió 200, pero la operación falló;
//     el código en `extensions` dice por qué (NOT_FOUND, SIN_DISPONIBILIDAD...).
import { CombinedGraphQLErrors, ServerError, ServerParseError } from '@apollo/client/errors';
import { ErrorApi } from '../api/cliente.js';

const TIPO_POR_CODIGO = { NOT_FOUND: 'no-encontrado', SIN_DISPONIBILIDAD: 'sin-disponibilidad' };

export function aErrorApi(error) {
    if (!error) return null;
    if (error instanceof ErrorApi) return error;
    if (ServerError.is(error)) {
        const estado = error.statusCode;
        if (estado === 404) return new ErrorApi('no-encontrado', 'El servicio GraphQL no existe.', estado);
        if (estado >= 500) return new ErrorApi('servidor', 'El servidor respondió con un error (' + estado + ').', estado);
        return new ErrorApi('respuesta', 'El servidor rechazó la consulta (' + estado + ').', estado);
    }
    if (ServerParseError.is(error)) return new ErrorApi('respuesta', 'El servidor envió datos que no se pueden leer.');
    if (CombinedGraphQLErrors.is(error)) {
        const [primero] = error.errors;
        const tipo = TIPO_POR_CODIGO[primero?.extensions?.code] ?? 'consulta';
        return new ErrorApi(tipo, primero?.message ?? 'La consulta no se pudo completar.');
    }
    return new ErrorApi('red', 'No se pudo conectar con el servidor.');
}

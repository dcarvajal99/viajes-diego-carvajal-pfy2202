// Service Worker de MSW para el navegador: intercepta las peticiones a /api y las responde
// con los handlers. main.jsx lo inicia antes de dibujar la aplicación.
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers.js';

export const worker = setupWorker(...handlers);

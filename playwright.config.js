// Pruebas del recorrido en distintos motores de navegador (npm run test:navegadores): Chromium
// (Chrome y Edge) y Firefox. Corren contra la versión compilada, servida por `vite preview` con
// la misma subcarpeta que GitHub Pages.
//
// WebKit (el motor de Safari) se agrega con CON_WEBKIT=1. En el equipo de desarrollo (macOS 26.0)
// el WebKit 27.2 de Playwright se cierra al abrir cualquier página, incluso about:blank, así que
// Safari se revisó a mano sobre el sitio publicado (ver README).
import { defineConfig, devices } from '@playwright/test';

const PUERTO = 4183;
// Con SITIO=<url> las mismas pruebas corren contra el sitio publicado (por ejemplo, GitHub Pages).
const SITIO = process.env.SITIO;

export default defineConfig({
    testDir: 'navegadores',
    fullyParallel: true,
    reporter: [['list']],
    use: {
        baseURL: SITIO ?? `http://localhost:${PUERTO}/viajes-diego-carvajal-pfy2202/`,
        trace: 'retain-on-failure',
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
        ...(process.env.CON_WEBKIT ? [{ name: 'webkit', use: { ...devices['Desktop Safari'] } }] : []),
    ],
    webServer: SITIO ? undefined : {
        command: `npm run build && npx vite preview --port ${PUERTO} --strictPort`,
        url: `http://localhost:${PUERTO}/viajes-diego-carvajal-pfy2202/`,
        reuseExistingServer: false,
        timeout: 120000,
    },
});

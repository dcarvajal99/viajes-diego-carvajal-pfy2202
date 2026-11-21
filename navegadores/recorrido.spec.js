// Casos X: el recorrido de la agencia en Chromium, Firefox y WebKit. Ver pruebas/matriz-de-casos.md.
import { expect, test } from '@playwright/test';

// Elementos de una lista (solo los hijos directos: las etiquetas de cada tarjeta también son <li>).
const elementos = (page, nombre) => page.getByRole('list', { name: nombre, exact: true }).locator(':scope > li');

// Elige el modo del servidor simulado antes de que cargue la página (lo lee de sessionStorage).
async function modoServidor(page, modo) {
    await page.addInitScript((valor) => sessionStorage.setItem('rumbo-austral-simulacion', valor), modo);
}

test('X1 filtrar, elegir vuelo y hotel, y reservar', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('status').filter({ hasText: '9 destinos' })).toBeVisible();

    await page.getByRole('button', { name: /Europa/ }).click();
    await expect(page).toHaveURL(/region=Europa/);
    await expect(elementos(page, 'Destinos')).toHaveCount(2);

    await page.getByRole('link', { name: 'Ver vuelos y hoteles a Lisboa' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Lisboa' })).toBeVisible();
    const vuelo = page.getByRole('article').filter({ hasText: 'TP0108' });
    await vuelo.getByRole('button', { name: 'Elegir vuelo' }).click();
    // Quinta de Sintra recibe huéspedes desde febrero: no sirve para el vuelo de diciembre.
    await expect(page.getByRole('article').filter({ hasText: 'Quinta de Sintra' })).toContainText('No disponible en tus fechas');
    await page.getByRole('article').filter({ hasText: 'Hotel Chiado' }).getByRole('button', { name: 'Elegir hotel' }).click();
    await expect(page.getByRole('complementary')).toContainText('$3.499.880');

    await page.getByRole('link', { name: 'Revisar y reservar' }).click();
    await expect(page).toHaveURL(/mi-viaje$/);
    await page.getByRole('button', { name: 'Confirmar reserva' }).click();
    await expect(page.getByRole('heading', { name: 'Reserva confirmada' })).toBeVisible();
    await expect(page.getByText(/Código RA-\d+/)).toBeVisible();
});

test('X2 error del servidor en un destino y reintento', async ({ page }) => {
    await modoServidor(page, 'error');
    await page.goto('destinos/cusco');
    const avisos = page.getByRole('alert');
    await expect(avisos).toHaveCount(2);
    await expect(avisos.first()).toContainText('Ficha del destino · API REST');
    await expect(avisos.last()).toContainText('Vuelos y hoteles · API GraphQL');
    await expect(avisos.last()).toContainText('(500)');

    await page.getByRole('radio', { name: /Normal/ }).check();
    // Cada «Reintentar» recupera su consulta y su aviso desaparece: se pulsan de a uno.
    const reintentar = page.getByRole('button', { name: 'Reintentar' });
    while (await reintentar.count() > 0) await reintentar.first().click();
    await expect(page.getByRole('heading', { level: 1, name: 'Cusco' })).toBeVisible();
    await expect(elementos(page, 'Vuelos a Cusco')).toHaveCount(3);
    await expect(page.getByRole('alert')).toHaveCount(0);
});

test('X3 recargar una ruta publicada y abrir una inexistente', async ({ page }) => {
    const respuesta = await page.goto('destinos/tokio');
    expect(respuesta.status()).toBe(200);
    // Como una persona: recarga cuando la página ya está a la vista.
    await expect(elementos(page, 'Hoteles en Tokio')).toHaveCount(3);
    await page.reload();
    await expect(page.getByRole('heading', { level: 1, name: 'Tokio' })).toBeVisible();
    await expect(elementos(page, 'Hoteles en Tokio')).toHaveCount(3);

    await page.goto('destinos/marte');
    await expect(page.getByRole('heading', { level: 1, name: 'Destino no encontrado' })).toBeVisible();
    await page.goto('vuelos');
    await expect(page.getByRole('heading', { level: 1, name: 'Página no encontrada' })).toBeVisible();
});

test('X4 en el teléfono no hay desborde horizontal', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const ruta of ['./', 'destinos/madrid', 'mi-viaje']) {
        await page.goto(ruta);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await page.waitForLoadState('networkidle');
        const desborde = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
        expect(desborde, 'desborde en ' + ruta).toBe(false);
    }
});

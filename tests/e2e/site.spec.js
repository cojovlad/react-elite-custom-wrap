import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (error) => {
    throw error;
  });
});

test('loads in Romanian and removes the skeleton', async ({ page }) => {
  await page.goto('/?lang=ro');
  await expect(page).toHaveTitle(
    'Elite Custom Wrap — Colantare auto premium, folie PPF și chrome delete',
  );
  await expect(page.locator('html')).toHaveAttribute('lang', 'ro');
  await expect(page.locator('#page-skeleton')).toHaveCount(0);
  await expect(page.locator('#swatches .swatch').first()).toBeAttached();
});

test('changes brand, colour and material', async ({ page }) => {
  await page.goto('/?lang=ro');
  await page.locator('[data-brand="Audi"]').click();
  await expect(page.locator('#vehicle-brand')).toHaveText('Audi');
  await expect(page.locator('#model-select')).toHaveValue('audi-rs7');

  await page.locator('#play-swatches .swatch:nth-child(4)').click();
  await expect(page.locator('#hex-value')).toHaveText('#B8BEC4');
  await expect(page.locator('#film-name')).toHaveText('Argintiu arctic');
  await expect(page.locator('.play-materials')).toBeVisible();

  await page.locator('[data-play-material="matte"]').click();
  await expect(page.locator('[data-play-material="matte"]')).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});

test('client film catalogue shows only the finishes of a film', async ({
  page,
}) => {
  await page.goto('/?lang=ro');
  await page.locator('#film-catalog > summary').click();
  await page.locator('#film-search').fill('millennium grey');
  await page.locator('#swatches .swatch').first().click();
  await expect(page.locator('#film-name')).toContainText('Millennium grey');
  await expect(page.locator('.film-finishes')).toBeVisible();
  await expect(page.locator('.play-materials')).toBeHidden();
});

test('switches language and remembers it', async ({ page }) => {
  await page.goto('/?lang=en');
  await page.locator('#language-select').selectOption('de');
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await expect(page).toHaveTitle(/Premium-Autofolierung/);
  expect(
    await page.evaluate(() => localStorage.getItem('elite-wrap-language-v1')),
  ).toBe('de');
});

test('consultation form opens WhatsApp with the client car', async ({
  page,
}) => {
  await page.goto('/?lang=ro');
  await page.evaluate(() => {
    window.__opened = '';
    window.open = (url) => {
      window.__opened = url;
      return {};
    };
  });
  await page.locator('[data-consult]:visible').first().click();
  const form = page.locator('#consult-form');
  await form.locator('[name=name]').fill('Ion Popescu');
  await form.locator('[name=email]').fill('ion@example.com');
  await form.locator('[name=phone]').fill('+40 700 000 000');
  await form.locator('label:has([name=carMatch][value=no])').click();
  await form.locator('[name=ownCar]').fill('Dacia Logan 2019');
  await form.locator('label:has([name=services])').nth(1).click();
  await expect(form.locator('[name=services]').nth(1)).toBeChecked();
  await form.evaluate((element) => element.requestSubmit());

  await expect
    .poll(() => page.evaluate(() => window.__opened))
    .toContain('wa.me/40773239125');
  const message = decodeURIComponent(
    await page.evaluate(() => window.__opened),
  );
  expect(message).toContain('*Nume:* Ion Popescu');
  expect(message).toContain('*Vehicul:* Dacia Logan 2019 (previzualizare pe:');
});

test('shared design link restores the design', async ({ page }) => {
  await page.goto(
    '/?vehicle=audi-rs7&body=af222b%7Ehigh-gloss&hood=af222b%7Ehigh-gloss&roof=af222b%7Ehigh-gloss&mirrors=af222b%7Ehigh-gloss&wheels=skyfol-piano-black&accents=skyfol-champagne-gold&lang=en',
  );
  await expect(page.locator('#vehicle-model')).toHaveText(
    'RS 7 Sportback (2014)',
  );
  await expect(page.locator('#hex-value')).toHaveText('#AF222B');
  await expect(page.locator('#selection-summary')).toHaveText(
    'Signal red · High gloss',
  );
});

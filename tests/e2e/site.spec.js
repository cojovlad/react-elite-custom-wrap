import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (error) => {
    throw error;
  });
  // Never email the studio from tests.
  await page.route('https://formsubmit.co/**', (route) =>
    route.fulfill({ json: { success: 'true' } }),
  );
});

test('loads in Romanian and removes the skeleton', async ({ page }) => {
  await page.goto('/?lang=ro');
  await expect(page).toHaveTitle(
    'Colantare auto și folie PPF în Cluj-Napoca | Elite Custom Wrap',
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
  await expect(page).toHaveTitle(
    /Autofolierung & Lackschutzfolie in Cluj-Napoca/,
  );
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
  const summary = page.locator('#brief-summary');
  const configured = (await summary.textContent()).split(' · ')[0];
  await form.locator('label:has([name=carMatch][value=no])').click();
  await expect(summary).toHaveText(/^Vehiculul tău · /);
  await form.locator('[name=ownCar]').fill('Dacia Logan 2019');
  await form.locator('[name=ownCar]').press('Enter');
  await expect(summary).toHaveText(/^Dacia Logan 2019 · finisaj /);
  await expect(summary).not.toContainText(configured);
  await expect(form).toBeVisible();
  await form.locator('label:has([name=services])').nth(1).click();
  await expect(form.locator('[name=services]').nth(1)).toBeChecked();
  await form.locator('label:has([value="Front PPF"])').click();
  await expect(form.locator('[name=size][value=sedan]')).toBeChecked();
  await expect(form.locator('#request-estimate')).toHaveText(
    '13.490 – 14.490 lei',
  );
  const emailRequest = page.waitForRequest('https://formsubmit.co/**');
  await form.evaluate((element) => element.requestSubmit());
  expect((await emailRequest).url()).toBe(
    'https://formsubmit.co/ajax/elite.custom_cluj%40yahoo.com',
  );

  await expect
    .poll(() => page.evaluate(() => window.__opened))
    .toContain('wa.me/40773239125');
  const message = decodeURIComponent(
    await page.evaluate(() => window.__opened),
  );
  expect(message).toContain('*Nume:* Ion Popescu');
  expect(message).toContain('*Vehicul:* Dacia Logan 2019 (previzualizare pe:');
  expect(message).toContain(
    '*Servicii:* Folie de protecție a vopselei, PPF frontal',
  );
  expect(message).toContain('*Mărimea mașinii:* Sedan / Break');
  expect(message).toContain(
    '*Estimare:* 13.490 – 14.490 lei (ofertă finală după verificare)',
  );
  expect(message).toContain(
    '*Detaliere estimare:* Folie de protecție a vopselei: 13.490 – 14.490 lei; PPF frontal: Inclus în PPF-ul complet',
  );
});

test('estimate explains what the total covers', async ({ page }) => {
  await page.goto('/?lang=ro');
  await page.locator('[data-consult]:visible').first().click();
  const form = page.locator('#consult-form');
  for (const service of [
    'Paint protection film',
    'Chrome delete',
    'Bespoke details',
  ])
    await form.locator(`label:has([value="${service}"])`).click();
  const items = form.locator('#request-estimate-items li');
  await expect(items).toHaveCount(3);
  await expect(items.nth(0)).toHaveText(
    'Folie de protecție a vopselei13.490 – 14.490 lei',
  );
  await expect(items.nth(1)).toHaveText('Chrome deleteLa cerere');
  await expect(form.locator('#request-estimate')).toHaveText(
    '13.490 – 14.490 lei',
  );
  await expect(form.locator('#request-estimate-note')).toContainText(
    'În afara totalului: Chrome delete și Detalii personalizate.',
  );
  await form.locator('label:has([value="Paint protection film"])').click();
  await expect(form.locator('#request-estimate')).toHaveText('La cerere');
  await expect(items).toHaveCount(2);
  const basis = form.locator('#request-estimate-basis');
  await expect(basis).toBeHidden();
  await form.locator('label:has([value="Color change wrap"])').click();
  await expect(basis).toBeVisible();
  await expect(basis).toContainText('Calculat după designul tău');
  await expect(form.locator('#request-estimate-design')).toHaveText(/ · /);
  await expect(form.locator('#request-estimate-why')).toHaveText(
    /^(Prețul colantării depinde|Ai ales culoarea liber)/,
  );
});

test('price list follows the vehicle size', async ({ page }) => {
  await page.goto('/?lang=ro');
  const pricing = page.locator('#pricing');
  const wrapFrom = pricing.locator('[data-price-category=wrap] .price-from');
  await expect(pricing.locator('.price-size-name')).toHaveText('Sedan / Break');
  await expect(wrapFrom).toContainText('9.990 lei');
  await expect(pricing.locator('[data-line="3m-2080"]').first()).toHaveClass(
    /is-current/,
  );
  await pricing.locator('[data-price-size=suv]').click();
  await expect(pricing.locator('[data-price-size=suv]')).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(wrapFrom).toContainText('11.990 lei');
  await expect(
    pricing.locator('[data-price-category=ppf-front] .price-from'),
  ).toContainText('6.990 lei');
  await expect(page.locator('#price-estimate')).toHaveText('10.990 lei');
});

test('price list folds its films away on phones', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?lang=ro');
  const row = page.locator('[data-price-category=wrap]');
  const lines = row.locator('.price-lines li');
  const toggle = row.locator('.price-lines-toggle');
  await expect(row.locator('[data-line="3m-2080"]')).toBeVisible();
  await expect(lines.filter({ visible: true })).toHaveCount(1);
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(lines.filter({ visible: true })).toHaveCount(
    await lines.count(),
  );
  await expect(
    page.locator('[data-price-category=ppf-front] .price-lines'),
  ).toBeHidden();
});

test('services section offers front PPF', async ({ page }) => {
  await page.goto('/?lang=ro');
  const card = page.locator('.service-card', { hasText: 'PPF frontal' });
  await expect(card.locator('h3')).toHaveText('PPF frontal');
  await card.locator('[data-service="Front PPF"]').click();
  await expect(page.locator('#consult-dialog')).toBeVisible();
  await expect(
    page.locator('#consult-form [name=services][value="Front PPF"]'),
  ).toBeChecked();
});

test('work gallery opens studio photos in a viewer', async ({ page }) => {
  await page.goto('/?lang=ro');
  const items = page.locator('#work .work-item');
  await expect(items).toHaveCount(8);
  await expect(items.first().locator('img')).toHaveAttribute(
    'alt',
    /Elite Custom Wrap din Cluj-Napoca/,
  );
  await items.nth(2).locator('.work-open').click();
  const dialog = page.locator('#work-dialog');
  await expect(dialog).toBeVisible();
  await expect(page.locator('#work-dialog-car')).toHaveText(
    'Alfa Romeo Giulietta',
  );
  await expect(page.locator('#work-dialog-finish')).toHaveText(
    'Roșu lucios, plafon negru',
  );
  await expect(page.locator('#work-dialog-count')).toHaveText('03 / 08');
  await expect
    .poll(() =>
      page
        .locator('#work-dialog-image')
        .evaluate((image) => image.complete && image.naturalWidth),
    )
    .toBeGreaterThan(0);
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#work-dialog-count')).toHaveText('04 / 08');
  await page.locator('#work-prev').click();
  await page.locator('#work-prev').click();
  await expect(page.locator('#work-dialog-count')).toHaveText('02 / 08');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('reviews section shows client reviews and Google links', async ({
  page,
}) => {
  await page.goto('/?lang=ro');
  const section = page.locator('#reviews');
  await expect(section.locator('h2')).toContainText('clienții noștri');
  await expect(
    section.locator(
      'a[href*="writereview?placeid=ChIJwdTFXg0LSUcRJOha7a3XNB0"]',
    ),
  ).toHaveText('Lasă o recenzie pe Google ↗');
  await expect(
    section.locator(
      '.reviews-links a[href*="query_place_id=ChIJwdTFXg0LSUcRJOha7a3XNB0"]',
    ),
  ).toContainText('Citește recenziile noastre pe Google');
  const card = section.locator('.review-card:not([data-clone])', {
    hasText: 'Maghiar Răzvan',
  });
  await section.scrollIntoViewIfNeeded();
  await expect(card).toContainText('atent la detalii');
  await expect
    .poll(() =>
      card
        .locator('img.review-avatar')
        .evaluate((image) => image.complete && image.naturalWidth),
    )
    .toBeGreaterThan(0);
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

test('signature palettes suggest finishes and load real films', async ({
  page,
}) => {
  await page.goto('/?lang=ro');
  const section = page.locator('#collection');
  await section.scrollIntoViewIfNeeded();
  // After a few seconds on screen the next finish is suggested.
  await expect(
    page.locator('[data-palette-direction="gloss"]'),
  ).toHaveAttribute('aria-pressed', 'true', { timeout: 15_000 });
  await expect(section.locator('.palette-card h3').first()).toHaveText(
    'Nardo Classic',
  );

  await page.locator('[data-palette-direction="ppf"]').click();
  const card = section.locator('.palette-card').first();
  await expect(card.locator('h3')).toHaveText('Miami');
  await expect(card.locator('.palette-caption')).toHaveText(
    '01 / PPF · LUCIOS',
  );
  await card.click();
  await expect(page.locator('#hex-value')).toHaveText('#00A3D9');
  await expect(page.locator('#film-name')).toContainText('Miami Blue');
});

test('footer links to the privacy policy', async ({ page }) => {
  await page.goto('/?lang=ro');
  const link = page.locator('.footer-legal a[href="/privacy.html"]');
  await expect(link).toHaveText('Politica de confidențialitate');
  await expect(page.locator('#company-legal')).toBeHidden();
  await link.click();
  await expect(page).toHaveURL(/\/privacy\.html$/);
  await expect(page.locator('#ro h1')).toHaveText(
    'Politica de confidențialitate.',
  );
  await expect(page.locator('#ro [data-contact=email]').first()).toHaveText(
    'elite.custom_cluj@yahoo.com',
  );
});

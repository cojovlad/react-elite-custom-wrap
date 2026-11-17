// Price list section: vehicle size tabs, a line-art silhouette of the size and
// one row per service, rendered from the studio price grid.
import { $, reducedMotion } from './dom.js';
import { getLocale, t } from './i18n.js';
import {
  categoryRange,
  filmLine,
  formatRange,
  priceLines,
  SIZES,
  sizeLabel,
} from './pricing.js';
import { SILHOUETTES } from './price-silhouettes.js';

const FADE_MS = 220;
let size = 'sedan';
let chosen = false;
let current = null;
let fadeTimer = 0;

export const priceText = (range) =>
  t('{price} RON', { price: formatRange(range, getLocale()) });

function drawSilhouette() {
  const spec = SILHOUETTES[size];
  const svg = $('.price-silhouette');
  svg.querySelector('.price-body').setAttribute('d', spec.body);
  svg.querySelector('.price-glass').setAttribute('d', spec.glass);
  const wheels = svg.querySelectorAll('.price-wheel');
  const hubs = svg.querySelectorAll('.price-hub');
  spec.wheels.forEach(([cx, cy, tyre, rim], index) => {
    for (const [circle, r] of [
      [wheels[index], tyre],
      [hubs[index], rim],
    ]) {
      circle.setAttribute('cx', cx);
      circle.setAttribute('cy', cy);
      circle.setAttribute('r', r);
    }
  });
}

// Visible text only, so it can be rendered for every language while layout
// space is reserved.
export function renderPricing(scope) {
  const section = $('#pricing');
  if (scope && !scope.contains(section)) return;
  const info = SIZES.find((item) => item.id === size);
  section.querySelector('.price-size-name').textContent = t(info.label);
  section.querySelector('.price-examples').textContent = info.examples;
  section.querySelectorAll('[data-price-category]').forEach((row) => {
    const { priceCategory } = row.dataset;
    row.querySelector('.price-from strong').textContent = priceText({
      min: categoryRange(priceCategory, size).min,
      max: categoryRange(priceCategory, size).min,
    });
    row.querySelectorAll('[data-line]').forEach((item) => {
      const line = priceLines(priceCategory).find(
        ({ id }) => id === item.dataset.line,
      );
      const price = line.prices[size];
      item.lastElementChild.textContent = priceText({ min: price, max: price });
    });
  });
}

function markCurrent() {
  document.querySelectorAll('#pricing [data-line]').forEach((item) => {
    const active =
      current?.[0] ===
        item.closest('[data-price-category]').dataset.priceCategory &&
      current?.[1] === item.dataset.line;
    item.classList.toggle('is-current', active);
    if (active) item.setAttribute('aria-current', 'true');
    else item.removeAttribute('aria-current');
  });
}

function setSize(id, { animate = true } = {}) {
  if (id === size) return;
  size = id;
  document.querySelectorAll('[data-price-size]').forEach((button) => {
    const active = button.dataset.priceSize === id;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  const board = $('.price-board');
  clearTimeout(fadeTimer);
  const update = () => {
    drawSilhouette();
    renderPricing();
    board.classList.remove('is-changing');
  };
  if (!animate || reducedMotion()) {
    update();
    return;
  }
  board.classList.add('is-changing');
  fadeTimer = setTimeout(update, FADE_MS);
}

// Follows the configurator car until the visitor picks a size, and marks the
// price line of the body film.
export function setPricingDesign({ vehicleSize, film }) {
  current = film ? filmLine(film) : null;
  markCurrent();
  if (!chosen) setSize(vehicleSize, { animate: false });
}

// The size the visitor picked here, if any.
export const chosenPricingSize = () => (chosen ? size : null);

export function initPricing() {
  document.querySelectorAll('[data-price-category]').forEach((row) => {
    const list = row.querySelector('.price-lines');
    list.id = `price-lines-${row.dataset.priceCategory}`;
    list.replaceChildren(
      ...priceLines(row.dataset.priceCategory).map((line) => {
        const item = document.createElement('li');
        item.dataset.line = line.id;
        const name = document.createElement('span');
        name.textContent = line.name;
        item.append(name, document.createElement('span'));
        return item;
      }),
    );
    // On phones the full film list folds away behind this button.
    const toggle = row.querySelector('.price-lines-toggle');
    if (!toggle) return;
    toggle.setAttribute('aria-controls', list.id);
    toggle.addEventListener('click', () => {
      const open = row.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  });
  $('.price-sizes').addEventListener('click', (event) => {
    const button = event.target.closest('[data-price-size]');
    if (!button) return;
    chosen = true;
    setSize(button.dataset.priceSize);
  });
  drawSilhouette();
  renderPricing();
}

export const sizeName = (id) => t(sizeLabel(id));

const INCLUDED = {
  'Coloured PPF': 'Included in the coloured PPF',
  'Paint protection film': 'Included in the full PPF',
};

const listText = (names) =>
  new Intl.ListFormat(getLocale(), { type: 'conjunction' }).format(
    names.map((name) => t(name)),
  );

// One estimate row: its service and its price, "included" or "on request".
export const estimateRow = (row) => [
  t(row.label ?? row.service),
  row.onRequest
    ? t('On request')
    : row.includedIn
      ? t(INCLUDED[row.includedIn])
      : priceText(row),
];

// The total for the message: "24.480 – 25.480 lei (final offer after
// inspection)", "On request" when nothing has a list price, '' without
// services.
export function estimateText(estimate) {
  if (!estimate) return '';
  if (!estimate.items) return t('On request');
  return `${priceText(estimate)} (${t('final offer after inspection')})`;
}

// Per-service breakdown for the message, when more than one service is chosen.
export const breakdownText = (estimate) =>
  estimate?.rows.length > 1
    ? estimate.rows.map((row) => estimateRow(row).join(': ')).join('; ')
    : '';

// What the total covers and what is quoted separately.
export function estimateNote(estimate) {
  if (!estimate) return t('Choose a service to see an estimate.');
  const quoted = t(
    'Quoted once we see the car, as the price depends on the trim and the details you want.',
  );
  if (!estimate.items) return quoted;
  if (!estimate.onRequest.length)
    return t('Final price after we inspect the car.');
  return `${t('Outside the total: {services}.', {
    services: listText(estimate.onRequest),
  })} ${quoted}`;
}

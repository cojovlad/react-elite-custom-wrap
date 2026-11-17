// The configurator: application state, controls and the consultation flow.
// Pure logic lives in design.js, film-catalog.js and request.js.
import { BRANDS, VEHICLES } from './vehicles.js';
import { PARTS } from './parts.js';
import {
  captureStaticTranslations,
  getLocale,
  languages,
  loadTranslations,
  setLocale,
  t,
} from './i18n.js';
import { createLayoutStability, SETTLE_MS } from './layout-stability.js';
import { CONTACT } from './config.js';
import { companyLine } from './company.js';
import { FILM_MAKERS } from './films.js';
import { MATERIALS, MATERIAL_GROUPS } from './materials.js';
import {
  defaultDesign,
  designFromFilms,
  designFromParams,
  designUrl,
  FILM_BY_ID,
  flipColors,
  PAINTED,
  PLAY_COLORS,
  PLAY_MATERIALS,
  validateDesign,
  validHex,
} from './design.js';
import { filmVariants, filterFilms, swatchBackground } from './film-catalog.js';
import {
  briefLines,
  openWhatsapp,
  requestFields,
  sendRequestEmail,
  SERVICES,
  validateRequest,
  whatsappMessage,
  whatsappUrl,
} from './request.js';
import { $, downloadFile, reducedMotion, revealPage } from './dom.js';
import { notify, translateToast } from './toast.js';
import { initWhatsappFloat, scheduleWhatsappYield } from './whatsapp-float.js';
import { initNavigation, translateNavigation } from './navigation.js';
import { registerServiceWorker } from './service-worker-client.js';
import { createWorkGallery } from './work-gallery.js';
import { createReviews } from './reviews.js';
import {
  initPaletteShowcase,
  paletteFilms,
  renderPaletteText,
} from './palette-showcase.js';
import {
  requestEstimate,
  SPECIAL_MATERIALS,
  vehicleSize,
  wrapEstimate,
} from './pricing.js';
import {
  breakdownText,
  chosenPricingSize,
  estimateNote,
  estimateRow,
  estimateText,
  initPricing,
  priceText,
  renderPricing,
  setPricingDesign,
} from './price-showcase.js';

await loadTranslations();

const STORAGE_KEY = 'noir-wrap-design-v1';
const getPartName = (id) => t(PARTS.find((part) => part.id === id).label);
const getMaterialName = (material) => t(MATERIALS[material]?.label ?? 'Gloss');
const filmFinish = (film) => getMaterialName(film.material);

// Short label, e.g. "Avery Dennison Jade (CP0090001)" or "Bone white".
function describePart(part) {
  const film = FILM_BY_ID.get(state.films[part]);
  if (film)
    return `${film.maker} ${film.name}${film.code ? ` (${film.code})` : ''}`;
  const play = PLAY_COLORS.find(({ hex }) => hex === state.colors[part]);
  return play
    ? t(play.name)
    : t('Custom {hex}', { hex: state.colors[part].toUpperCase() });
}
// Label plus finish for summaries and requests.
function describePartFull(part) {
  const film = FILM_BY_ID.get(state.films[part]);
  return film
    ? `${describePart(part)} · ${filmFinish(film)}`
    : `${describePart(part)} · ${getMaterialName(state.materials[part])}`;
}
let state = defaultDesign();
let selectedPart = 'body';
let filmMaker = 'all';
let filmGroup = 'all';
let filmQuery = '';
let scene;
let storageWarning = false;
let autoRotate = false;
let searchQuery = '';
let availableParts = new Set(PARTS.map(({ id }) => id));
let generatedVehicle = '';
let requestResult = null;
let sendingRequest = false;
let revealedBrand = '';
let sizeTouched = false;
const translateStatic = captureStaticTranslations();
const layout = createLayoutStability({
  locales: Object.keys(languages),
  getLocale,
  render: (locale, scope) => {
    setLocale(locale, { persist: false });
    translateStatic(scope);
    renderLocalizedText(scope);
  },
});
const workGallery = createWorkGallery(layout);
const reviews = createReviews();

function restoreDesign() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('vehicle')) {
    const shared = designFromParams(params);
    if (shared) state = shared;
    else
      notify(
        'This design link is incomplete or invalid. The default design has been loaded.',
      );
    return;
  }
  let saved;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    storageWarning = true;
    notify(
      'Local saving is unavailable ({error}). You can still share or download your design.',
      { error: error.name },
    );
    return;
  }
  if (!saved) return;
  let parsed;
  try {
    parsed = JSON.parse(saved);
  } catch (error) {
    notify(
      'The saved design could not be read ({error}). Starting a new design.',
      { error: error.name },
    );
    return;
  }
  const validated = validateDesign(parsed);
  if (validated) state = validated;
  else notify('The saved design is not compatible. Starting a new design.');
}

function persistDesign() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    if (!storageWarning) {
      notify(
        'Your browser cannot save this design ({error}). Use Share design to keep it.',
        { error: error.name },
      );
      storageWarning = true;
    }
  }
}

const currentDesignUrl = () => designUrl(window.location.href, state);

function syncAddress() {
  // Keep an opened shared link in sync with later edits without adding history entries.
  if (!new URLSearchParams(window.location.search).has('vehicle')) return;
  history.replaceState(null, '', currentDesignUrl());
}

function setPressed(selector, isActive) {
  document.querySelectorAll(selector).forEach((button) => {
    const active = isActive(button);
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function updateControls() {
  const vehicle = VEHICLES.find((item) => item.id === state.vehicle);
  renderModelOptions();
  $('#vehicle-brand').textContent = vehicle.brand;
  $('#vehicle-model').textContent = vehicle.model;
  $('#car-canvas').setAttribute(
    'aria-label',
    t(
      '{vehicle} 3D wrap concept. Drag to rotate or use the view buttons. Selected panel: {part}.',
      {
        vehicle: `${vehicle.brand} ${vehicle.model}`,
        part: getPartName(selectedPart),
      },
    ),
  );
  $('#part-select').value = selectedPart;
  for (const option of $('#part-select').options) {
    const part = PARTS.find(({ id }) => id === option.value);
    option.disabled = !availableParts.has(part.id);
    option.textContent = option.disabled
      ? t('{part} — not available on this model', { part: t(part.label) })
      : t(part.label);
  }
  const color = state.colors[selectedPart];
  $('#hex-value').textContent = color.toUpperCase();
  $('#custom-color').value = color;
  setPricingDesign({
    vehicleSize: vehicleSize(vehicle),
    film: FILM_BY_ID.get(state.films.body),
  });
  renderLocalizedText();
  document.querySelectorAll('[data-brand]').forEach((button) => {
    const active = button.dataset.brand === vehicle.brand;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute(
      'aria-label',
      t('Choose {brand} models', { brand: button.dataset.brand }),
    );
  });
  if (revealedBrand !== vehicle.brand) {
    revealedBrand = vehicle.brand;
    revealActiveBrand();
  }
  const film = state.films[selectedPart];
  setPressed('[data-film]', (button) => button.dataset.film === film);
  setPressed(
    '[data-color]',
    (button) => !film && button.dataset.color === color,
  );
  setPressed(
    '[data-play-material]',
    (button) =>
      !film && button.dataset.playMaterial === state.materials[selectedPart],
  );
  setPressed(
    '[data-film-group]',
    (button) => button.dataset.filmGroup === filmGroup,
  );
}

// Visible text that depends on the locale and the current design. It is also
// rendered for every locale while layout space is reserved, so it must not
// change state or replace elements.
function renderLocalizedText(scope) {
  const root = scope || document.body;
  const vehicle = VEHICLES.find((item) => item.id === state.vehicle);
  const film = FILM_BY_ID.get(state.films[selectedPart]);
  const render = (selector, text) => {
    const element = $(selector);
    if (root.contains(element)) element.textContent = text;
  };
  render('#vehicle-type', `${t(vehicle.type)} / ${t('Wrap preview')}`);
  render('#color-label', t('Play with any colour'));
  render('#film-name', describePart(selectedPart));
  render(
    '#film-meta',
    film
      ? [film.range, film.finish || filmFinish(film), film.ppf ? 'PPF' : '']
          .filter(Boolean)
          .join(' · ')
      : getMaterialName(state.materials[selectedPart]),
  );
  render(
    '#film-note',
    film?.estimated
      ? t('Approximate on-screen colour. Confirm with a physical sample.')
      : film
        ? t('Manufacturer RGB reference. Confirm with a physical sample.')
        : t('Custom shade. We will match it to the closest real film.'),
  );
  render('#film-count', filmCountText());
  document.querySelectorAll('[data-film-group]').forEach((button) => {
    if (root.contains(button))
      button.textContent = t(
        MATERIAL_GROUPS.find(({ id }) => id === button.dataset.filmGroup).label,
      );
  });
  document.querySelectorAll('[data-play-material]').forEach((button) => {
    if (root.contains(button))
      button.textContent = getMaterialName(button.dataset.playMaterial);
  });
  if (root.contains($('.film-finishes'))) renderFilmFinishes();
  document.querySelectorAll('[data-color]').forEach((button) => {
    if (!root.contains(button)) return;
    const name = t(
      PLAY_COLORS.find(({ hex }) => hex === button.dataset.color).name,
    );
    button.setAttribute('aria-label', name);
    button.title = name;
  });
  render('#selection-summary', describePartFull(selectedPart));
  render(
    '#price-estimate',
    priceText(
      wrapEstimate(
        vehicleSize(vehicle),
        FILM_BY_ID.get(state.films.body),
        state.materials.body,
      ),
    ),
  );
  render('#catalog-count', catalogCountText());
  const greeting = whatsappUrl(
    t("Hello Elite Custom Wrap! I'd like to ask about wrapping my car."),
  );
  document.querySelectorAll('[data-whatsapp]').forEach((link) => {
    if (root.contains(link)) link.href = greeting;
  });
  if (requestResult && root.contains($('#brief-success')))
    renderRequestResult();
  if ($('#consult-dialog').open && root.contains($('#brief-summary')))
    updateBriefSummary();
  if (root.contains($('#request-estimate'))) renderRequestEstimate();
  renderPaletteText(scope);
  renderPricing(scope);
  workGallery.render(scope);
  reviews.render(scope);
}

// Keeps the active brand visible in a long, horizontally scrolling strip
// without scrolling the page itself.
function revealActiveBrand() {
  const strip = $('#vehicle-tabs');
  const active = strip.querySelector('.vehicle-tab.active');
  if (!active || strip.scrollWidth <= strip.clientWidth) return;
  const stripRect = strip.getBoundingClientRect();
  const tabRect = active.getBoundingClientRect();
  if (
    tabRect.left >= stripRect.left + 24 &&
    tabRect.right <= stripRect.right - 24
  )
    return;
  strip.scrollBy({
    left: tabRect.left - stripRect.left - (stripRect.width - tabRect.width) / 2,
    behavior: reducedMotion() ? 'instant' : 'smooth',
  });
}

function updateBrandOverflow() {
  const strip = $('#vehicle-tabs');
  const max = strip.scrollWidth - strip.clientWidth;
  strip.classList.toggle('can-scroll-start', strip.scrollLeft > 2);
  strip.classList.toggle('can-scroll-end', strip.scrollLeft < max - 2);
}

function matchingVehicles() {
  return VEHICLES.filter((vehicle) =>
    `${vehicle.brand} ${vehicle.model}`.toLowerCase().includes(searchQuery),
  );
}

function catalogCountText() {
  const count = matchingVehicles().length;
  return searchQuery
    ? t(
        count === 1 ? '{count} matching vehicle' : '{count} matching vehicles',
        {
          count,
        },
      )
    : t('{models} models / {brands} brands · Luxury first', {
        models: VEHICLES.length,
        brands: BRANDS.length,
      });
}

function applyDesign({ vehicleChanged = false } = {}) {
  if (vehicleChanged) scene?.setVehicle(state.vehicle);
  scene?.setColors(state.colors, state.materials, flipColors(state));
  updateControls();
  layout.schedule(SETTLE_MS, $('#configurator'));
  persistDesign();
  syncAddress();
}

const matchingFilms = () =>
  filterFilms({ maker: filmMaker, group: filmGroup, query: filmQuery });

function filmCountText() {
  const count = matchingFilms().length;
  return t(count === 1 ? '{count} film' : '{count} films', { count });
}

function renderSwatches() {
  const films = matchingFilms();
  const fragment = document.createDocumentFragment();
  for (const film of films) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'swatch';
    button.dataset.film = film.id;
    button.style.setProperty('--swatch-color', film.hex);
    button.style.background = swatchBackground(film);
    const label = `${film.maker} ${film.name}${film.code ? ` ${film.code}` : ''}, ${filmFinish(film)}`;
    button.setAttribute('aria-label', label);
    button.title = label;
    button.addEventListener('click', () => setFilm(film.id));
    fragment.append(button);
  }
  $('#swatches').replaceChildren(fragment);
  $('#film-count').textContent = filmCountText();
  updateControls();
}

function renderFilmFinishes() {
  const film = FILM_BY_ID.get(state.films[selectedPart]);
  const container = $('.film-finishes');
  $('.play-materials').hidden = Boolean(film);
  container.hidden = !film;
  if (!film) return container.replaceChildren();
  const variants = filmVariants(film);
  const current = [...container.children].map(
    (button) => button.dataset.filmVariant,
  );
  if (current.join() !== variants.map(({ id }) => id).join()) {
    container.replaceChildren(
      ...variants.map((variant) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.filmVariant = variant.id;
        button.addEventListener('click', () => setFilm(variant.id));
        return button;
      }),
    );
  }
  for (const button of container.children) {
    const variant = FILM_BY_ID.get(button.dataset.filmVariant);
    button.textContent = getMaterialName(variant.material);
    const active = variant.id === film.id;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  }
}

// "Apply to all painted panels" also changes body, hood, roof and mirrors.
const targetParts = () =>
  $('#apply-all').checked
    ? [...new Set([...PAINTED, selectedPart])]
    : [selectedPart];

function setFilm(id) {
  const film = FILM_BY_ID.get(id);
  if (!film) return;
  for (const part of targetParts()) {
    state.films[part] = film.id;
    state.colors[part] = film.hex;
    state.materials[part] = film.material;
  }
  applyDesign();
}

function renderModelOptions() {
  const selected = VEHICLES.find((vehicle) => vehicle.id === state.vehicle);
  const matches = matchingVehicles();
  const available = searchQuery
    ? matches
    : VEHICLES.filter((vehicle) => vehicle.brand === selected.brand);
  const select = $('#model-select');
  select.replaceChildren();
  if (!available.some((vehicle) => vehicle.id === selected.id)) {
    const current = new Option(
      t('{vehicle} (current)', {
        vehicle: `${selected.brand} ${selected.model}`,
      }),
      selected.id,
    );
    select.add(current);
  }
  for (const vehicle of available) {
    select.add(
      new Option(
        searchQuery ? `${vehicle.brand} — ${vehicle.model}` : vehicle.model,
        vehicle.id,
      ),
    );
  }
  select.value = state.vehicle;
  $('#catalog-count').textContent = catalogCountText();
  document.querySelectorAll('[data-brand]').forEach((button) => {
    button.hidden =
      Boolean(searchQuery) &&
      !matches.some((vehicle) => vehicle.brand === button.dataset.brand);
  });
  updateBrandOverflow();
}

function selectPart(part) {
  if (!PARTS.some(({ id }) => id === part)) return;
  if (!availableParts.has(part)) {
    notify('This surface is not available on the selected model.');
    return;
  }
  selectedPart = part;
  updateControls();
  layout.schedule(SETTLE_MS, $('#configurator'));
}

function setColor(color, material = state.materials[selectedPart]) {
  if (!validHex(color)) {
    notify('Please choose a valid six-digit color.');
    return;
  }
  for (const part of targetParts()) {
    state.films[part] = '';
    state.colors[part] = color;
    state.materials[part] = material;
  }
  applyDesign();
}

// The configurator car, or the visitor's own car once they say it differs.
function summaryVehicle() {
  const form = $('#consult-form');
  if (form.elements.namedItem('carMatch').value === 'no')
    return $('#consult-own-car').value.trim() || t('Your vehicle');
  const vehicle = VEHICLES.find((item) => item.id === state.vehicle);
  return `${vehicle.brand} ${vehicle.model}`;
}

function updateBriefSummary() {
  $('#brief-summary').textContent = t(
    '{vehicle} · {finish} finish · Body: {body} · Roof / rear deck: {roof}',
    {
      vehicle: summaryVehicle(),
      finish: getMaterialName(state.materials.body),
      body: describePart('body'),
      roof: describePart('roof'),
    },
  );
}

// The configurator car's size, unless the visitor picked one.
function requestSize() {
  const vehicle = VEHICLES.find((item) => item.id === state.vehicle);
  return (
    new FormData($('#consult-form')).get('size') ||
    chosenPricingSize() ||
    vehicleSize(vehicle)
  );
}

function formEstimate() {
  const data = new FormData($('#consult-form'));
  return requestEstimate({
    size: requestSize(),
    services: data
      .getAll('services')
      .filter((service) => SERVICES.includes(service)),
    film: FILM_BY_ID.get(state.films.body),
    material: state.materials.body,
  });
}

function renderRequestEstimate() {
  const estimate = formEstimate();
  const rows = estimate?.rows.length > 1 ? estimate.rows : [];
  const list = $('#request-estimate-items');
  // Same rows: update the text in place, so the layout reservation keeps
  // measuring the same elements in every language.
  if (list.children.length !== rows.length)
    list.replaceChildren(
      ...rows.map(() => {
        const item = document.createElement('li');
        item.append(
          document.createElement('span'),
          document.createElement('span'),
        );
        return item;
      }),
    );
  rows.forEach((row, index) => {
    const item = list.children[index];
    item.classList.toggle('is-muted', row.min === undefined);
    estimateRow(row).forEach((text, cell) => {
      item.children[cell].textContent = text;
    });
  });
  list.hidden = !rows.length;
  $('#request-estimate-label').textContent = t(
    estimate?.items?.length > 1 ? 'Estimated total' : 'Estimate',
  );
  $('#request-estimate').textContent = estimate?.items
    ? priceText(estimate)
    : estimate
      ? t('On request')
      : '—';
  $('#request-estimate-note').textContent = estimateNote(estimate);
  renderEstimateBasis();
}

// Which part of the design the wrap price follows, shown with the wrap only.
function renderEstimateBasis() {
  const wrap = new FormData($('#consult-form'))
    .getAll('services')
    .includes('Color change wrap');
  $('#request-estimate-basis').hidden = !wrap;
  if (!wrap) return;
  const film = FILM_BY_ID.get(state.films.body);
  $('#request-estimate-swatch').style.background = swatchBackground({
    hex: state.colors.body,
    material: state.materials.body,
    flip: film?.flip,
  });
  $('#request-estimate-design').textContent = describePartFull('body');
  $('#request-estimate-why').textContent = t(
    film
      ? 'The wrap price follows the film on the body. Change it in the configurator and the estimate changes too.'
      : SPECIAL_MATERIALS.has(state.materials.body)
        ? 'The colour is picked freely with a special finish, so we show the price of special films. We match it to a real film together.'
        : 'The colour is picked freely, so we show the price of standard films. We match it to a real film together.',
  );
}

function updateCarMatch({ focus = false } = {}) {
  const form = $('#consult-form');
  const match = form.elements.namedItem('carMatch').value || 'yes';
  form.querySelectorAll('[data-car-match]').forEach((label) => {
    const active = label.dataset.carMatch === match;
    label.hidden = !active;
    label.querySelector('input').disabled = !active;
  });
  if ($('#consult-dialog').open) layout.measure($('#consult-dialog'));
  if (focus && match === 'no') $('#consult-own-car').focus();
}

const generateVehicleText = () => {
  const vehicle = VEHICLES.find((item) => item.id === state.vehicle);
  return t('{vehicle} (add model year)', {
    vehicle: `${vehicle.brand} ${vehicle.model}`,
  });
};

function openConsult(service = '') {
  generatedVehicle = generateVehicleText();
  $('#consult-vehicle').value = generatedVehicle;
  if (SERVICES.includes(service))
    $('#consult-form').querySelector(
      `[name="services"][value="${service}"]`,
    ).checked = true;
  if (!sizeTouched) {
    const vehicle = VEHICLES.find((item) => item.id === state.vehicle);
    const size = chosenPricingSize() || vehicleSize(vehicle);
    $('#consult-form').querySelector(`[name="size"][value="${size}"]`).checked =
      true;
  }
  updateBriefSummary();
  renderRequestEstimate();
  $('#consult-form').hidden = false;
  $('#brief-success').hidden = true;
  updateCarMatch();
  $('#consult-dialog').showModal();
  layout.measure($('#consult-dialog'));
}

function collectRequest() {
  const data = new FormData($('#consult-form'));
  const text = (name) => String(data.get(name) ?? '').trim();
  const vehicle = VEHICLES.find(({ id }) => id === state.vehicle);
  return {
    name: text('name'),
    email: text('email'),
    phone: text('phone'),
    vehicle: text('vehicle'),
    ownCar: data.get('carMatch') === 'no' ? text('ownCar') : '',
    services: data
      .getAll('services')
      .filter((service) => SERVICES.includes(service)),
    size: requestSize(),
    estimate: estimateText(formEstimate()),
    breakdown: breakdownText(formEstimate()),
    notes: text('notes'),
    honey: text('_honey'),
    preview: `${vehicle.brand} ${vehicle.model}`,
    link: currentDesignUrl(),
  };
}

function renderRequestResult() {
  const { email, error } = requestResult;
  $('#request-title').textContent = t(
    email === 'sent' ? 'Your request is on its way.' : 'Almost done.',
  );
  $('#request-whatsapp-status').textContent = t(
    'WhatsApp opens with your request prefilled. Press Send there to deliver it to {number}.',
    { number: CONTACT.whatsappDisplay },
  );
  const emailStatus = $('#request-email-status');
  emailStatus.hidden = email === 'skipped';
  emailStatus.textContent =
    email === 'sent'
      ? t('A copy of your request was emailed to the studio.')
      : email === 'failed'
        ? t(
            'The email could not be sent ({error}). Your WhatsApp message and the downloadable brief still include every detail.',
            { error },
          )
        : '';
}

function downloadBrief() {
  const partLines = PARTS.map(
    ({ id, label }) =>
      `${t(label)}: ${describePartFull(id)} (${state.colors[id]})`,
  );
  downloadFile(
    briefLines(collectRequest(), partLines).join('\r\n'),
    'text/plain;charset=utf-8',
    'elite-custom-wrap-consultation-brief.txt',
  );
  notify('Your consultation brief has been downloaded.');
}

function showSceneError(error) {
  console.error('The vehicle preview could not be initialized:', error);
  $('#scene-error').hidden = false;
  ['#rotate', '#reset-view', '#download-preview'].forEach((id) => {
    $(id).disabled = true;
  });
  document.querySelectorAll('[data-view]').forEach((button) => {
    button.disabled = true;
  });
}

translateStatic();
initPaletteShowcase();
initPricing();
$('#language-select').value = getLocale();
restoreDesign();
$('#year').textContent = new Date().getFullYear();
$('#company-legal').textContent = companyLine();
$('#company-legal').hidden = !companyLine();
document.querySelectorAll('[data-whatsapp-number]').forEach((element) => {
  element.textContent = CONTACT.whatsappDisplay;
});
document.querySelectorAll('[data-email-mode]').forEach((element) => {
  element.hidden = element.dataset.emailMode !== (CONTACT.email ? 'on' : 'off');
});
BRANDS.forEach((brand) => {
  const button = document.createElement('button');
  button.className = 'vehicle-tab';
  button.dataset.brand = brand;
  button.setAttribute('aria-label', `Choose ${brand} models`);
  const monogram = document.createElement('span');
  monogram.className = 'brand-abbr';
  monogram.setAttribute('aria-hidden', 'true');
  monogram.textContent = brand[0];
  button.append(monogram, document.createTextNode(brand));
  button.addEventListener('click', () => {
    const vehicles = VEHICLES.filter(
      (vehicle) =>
        vehicle.brand === brand &&
        `${vehicle.brand} ${vehicle.model}`.toLowerCase().includes(searchQuery),
    );
    state.vehicle = vehicles[0].id;
    applyDesign({ vehicleChanged: true });
  });
  $('#vehicle-tabs').append(button);
});
$('#vehicle-tabs').addEventListener('scroll', updateBrandOverflow, {
  passive: true,
});
window.addEventListener('resize', updateBrandOverflow);
initWhatsappFloat();
$('#model-select').addEventListener('change', (event) => {
  state.vehicle = event.target.value;
  applyDesign({ vehicleChanged: true });
});
$('#vehicle-search').addEventListener('input', (event) => {
  searchQuery = event.target.value.trim().toLowerCase();
  renderModelOptions();
  layout.schedule(SETTLE_MS, $('#configurator'));
});
PARTS.forEach(({ id, label }) => {
  const option = document.createElement('option');
  option.value = id;
  option.textContent = label;
  $('#part-select').append(option);
});
FILM_MAKERS.forEach((maker) => $('#film-maker').add(new Option(maker, maker)));
MATERIAL_GROUPS.forEach(({ id, label }) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.filmGroup = id;
  button.textContent = label;
  button.addEventListener('click', () => {
    filmGroup = id;
    renderSwatches();
    layout.schedule(SETTLE_MS, $('#configurator'));
  });
  $('.film-groups').append(button);
});
PLAY_COLORS.forEach(({ hex }) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'swatch';
  button.dataset.color = hex;
  button.style.setProperty('--swatch-color', hex);
  button.addEventListener('click', () => setColor(hex));
  $('#play-swatches').append(button);
});
PLAY_MATERIALS.forEach((material) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.playMaterial = material;
  button.textContent = getMaterialName(material);
  button.addEventListener('click', () =>
    setColor(state.colors[selectedPart], material),
  );
  $('.play-materials').append(button);
});
$('#film-catalog').addEventListener('toggle', () =>
  layout.schedule(SETTLE_MS, $('#configurator')),
);
$('#film-maker').addEventListener('change', (event) => {
  filmMaker = event.target.value;
  renderSwatches();
});
$('#film-search').addEventListener('input', (event) => {
  filmQuery = event.target.value.trim().toLowerCase();
  renderSwatches();
});
renderSwatches();

// Three.js is loaded separately so the page text and controls appear first.
import('./car-scene.js').then(({ createCarScene }) => {
  try {
    scene = createCarScene($('#car-canvas'), {
      onSelectPart: selectPart,
      onError: showSceneError,
      onLoadStart: () => {
        $('#scene-error').hidden = true;
        $('#download-preview').disabled = true;
        $('#part-select').disabled = true;
      },
      onLoad: (id, parts) => {
        availableParts = new Set(parts);
        if (!availableParts.has(selectedPart)) selectedPart = 'body';
        $('#part-select').disabled = false;
        updateControls();
        $('#scene-error').hidden = true;
        ['#rotate', '#reset-view', '#download-preview'].forEach((selector) => {
          $(selector).disabled = false;
        });
        document.querySelectorAll('[data-view]').forEach((button) => {
          button.disabled = false;
        });
        const vehicle = VEHICLES.find((vehicle) => vehicle.id === id);
        $('#model-credit').textContent =
          `${vehicle.brand} ${vehicle.model} · ${vehicle.license ?? 'CC BY 4.0'}.`;
        layout.schedule(0, $('#configurator'));
      },
    });
    scene.setVehicle(state.vehicle);
    scene.setColors(state.colors, state.materials, flipColors(state));
  } catch (error) {
    showSceneError(error);
  }
}, showSceneError);
updateControls();

$('#part-select').addEventListener('change', (event) =>
  selectPart(event.target.value),
);
$('#custom-color').addEventListener('input', (event) =>
  setColor(event.target.value),
);
document.querySelectorAll('[data-view]').forEach((button) => {
  button.addEventListener('click', () => {
    scene?.setView(button.dataset.view);
    setPressed('[data-view]', (viewButton) => viewButton === button);
  });
});
$('#rotate').addEventListener('click', () => {
  autoRotate = !autoRotate;
  scene?.setAutoRotate(autoRotate);
  $('#rotate').setAttribute('aria-pressed', String(autoRotate));
  $('#rotate').setAttribute(
    'aria-label',
    t(autoRotate ? 'Disable automatic rotation' : 'Enable automatic rotation'),
  );
});
$('#reset-view').addEventListener('click', () => {
  scene?.resetView();
  setPressed('[data-view]', (button) => button.dataset.view === 'perspective');
});
$('#reset-design').addEventListener('click', () => {
  state = defaultDesign();
  selectedPart = 'body';
  $('#apply-all').checked = false;
  applyDesign({ vehicleChanged: true });
  notify('Your design has been reset to the signature palette.');
});
$('#download-preview').addEventListener('click', () => {
  try {
    scene?.download(`elite-custom-wrap-${state.vehicle}.png`);
    notify('Your preview is ready to download.');
  } catch (error) {
    notify(
      'Preview export is unavailable ({error}). You can still download a consultation brief.',
      { error: error.name },
    );
  }
});
document
  .querySelectorAll('[data-consult]')
  .forEach((button) => button.addEventListener('click', () => openConsult()));
document
  .querySelectorAll('[data-service]')
  .forEach((button) =>
    button.addEventListener('click', () => openConsult(button.dataset.service)),
  );
$('#other-vehicle').addEventListener('click', () => {
  openConsult();
  $('#consult-vehicle').value = '';
  $('#consult-vehicle').focus();
});
initNavigation(layout);
$('#consult-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (sendingRequest || !validateRequest(form)) return;
  sendingRequest = true;
  const submit = form.querySelector('[type="submit"]');
  submit.disabled = true;
  form.setAttribute('aria-busy', 'true');
  const request = collectRequest();
  const partFields = PARTS.filter(({ id }) => availableParts.has(id)).map(
    ({ id, label }) => [
      t(label),
      `${describePartFull(id)} (${state.colors[id].toUpperCase()})`,
    ],
  );
  const fields = requestFields(request, partFields);
  const url = whatsappUrl(whatsappMessage(fields));
  $('#request-whatsapp').href = url;
  // Opened inside the submit gesture so popup blockers allow the tab.
  const popup = openWhatsapp(url);
  let email;
  let error = '';
  try {
    email = await sendRequestEmail(request, fields);
  } catch (reason) {
    email = 'failed';
    error = ['AbortError', 'TimeoutError'].includes(reason.name)
      ? 'timeout'
      : reason.message || reason.name;
    console.warn('The request email could not be sent:', reason);
  }
  requestResult = { email, error };
  sendingRequest = false;
  submit.disabled = false;
  form.removeAttribute('aria-busy');
  renderRequestResult();
  form.hidden = true;
  $('#brief-success').hidden = false;
  layout.measure($('#consult-dialog'));
  $('#request-whatsapp').focus();
  if (!popup) window.location.href = url;
});
$('#consult-form').addEventListener('input', (event) =>
  event.target.setCustomValidity?.(''),
);
// Enter confirms the car name instead of submitting the half-filled form.
$('#consult-own-car').addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' || event.isComposing) return;
  event.preventDefault();
  updateBriefSummary();
  layout.measure($('#consult-dialog'));
});
$('#consult-form').addEventListener('change', (event) => {
  if (['carMatch', 'ownCar'].includes(event.target.name)) {
    updateBriefSummary();
    layout.measure($('#consult-dialog'));
  }
  if (event.target.name === 'carMatch') updateCarMatch({ focus: true });
  if (event.target.name === 'size') sizeTouched = true;
  if (['size', 'services'].includes(event.target.name)) {
    renderRequestEstimate();
    layout.measure($('#consult-dialog'));
  }
});
document
  .querySelectorAll('.brief-download')
  .forEach((button) => button.addEventListener('click', downloadBrief));
$('#edit-brief').addEventListener('click', () => {
  $('#consult-form').hidden = false;
  $('#brief-success').hidden = true;
  layout.measure($('#consult-dialog'));
  $('#consult-form input').focus();
});
$('#share-design').addEventListener('click', () => {
  $('#share-url').value = currentDesignUrl();
  $('#share-dialog').showModal();
  layout.measure($('#share-dialog'));
});
$('#copy-link').addEventListener('click', async () => {
  const input = $('#share-url');
  if (!navigator.clipboard || !window.isSecureContext) {
    input.focus();
    input.select();
    notify(
      'Select and copy the design link. Clipboard access needs HTTPS or localhost.',
    );
    return;
  }
  try {
    await navigator.clipboard.writeText(input.value);
    notify(
      'Design link copied. Every color and your selected vehicle are included.',
    );
    $('#share-dialog').close();
  } catch (error) {
    input.focus();
    input.select();
    notify(
      'Clipboard access was blocked ({error}). Copy the selected link manually.',
      { error: error.name },
    );
  }
});
document.querySelectorAll('[data-preset]').forEach((button) => {
  button.addEventListener('click', () => {
    state = {
      vehicle: state.vehicle,
      ...designFromFilms(paletteFilms(button.dataset.preset)),
    };
    selectedPart = 'body';
    applyDesign();
    $('#configurator').scrollIntoView({
      behavior: reducedMotion() ? 'instant' : 'smooth',
    });
    notify('Signature palette loaded. Make it your own.');
  });
});
$('#language-select').addEventListener('change', (event) => {
  const replaceVehicle = $('#consult-vehicle').value === generatedVehicle;
  setLocale(event.target.value);
  translateStatic();
  updateControls();
  scene?.translateLoading();
  $('#consult-form')
    .querySelectorAll('input, textarea')
    .forEach((input) => input.setCustomValidity(''));
  $('#rotate').setAttribute(
    'aria-label',
    t(autoRotate ? 'Disable automatic rotation' : 'Enable automatic rotation'),
  );
  translateNavigation();
  if ($('#consult-dialog').open) {
    generatedVehicle = generateVehicleText();
    if (replaceVehicle) $('#consult-vehicle').value = generatedVehicle;
    updateBriefSummary();
  }
  translateToast();
});
window.addEventListener('pagehide', (event) => {
  if (!event.persisted) scene?.dispose();
});
updateBrandOverflow();
scheduleWhatsappYield();
revealPage();
registerServiceWorker();

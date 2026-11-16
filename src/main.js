import { BRANDS, VEHICLES } from './vehicles.js';
import { PARTS } from './parts.js';
import {
  captureStaticTranslations,
  getLocale,
  languages,
  setLocale,
  t,
} from './i18n.js';
import { createLayoutStability, SETTLE_MS } from './layout-stability.js';
import { CONTACT } from './config.js';
import { FILMS, FILM_MAKERS } from './films.js';
import { MATERIALS, MATERIAL_GROUPS } from './materials.js';

const SERVICES = [
  'Color change wrap',
  'Paint protection film',
  'Chrome delete',
  'Bespoke details',
];
const FILM_BY_ID = new Map(FILMS.map((film) => [film.id, film]));
// Free-play palette: any colour, any finish. The studio films are the exact
// stock colours and live in the collapsible catalogue below.
const PLAY_COLORS = [
  { name: 'Bone white', hex: '#e8e2d6' },
  { name: 'Pure white', hex: '#f4f4f2' },
  { name: 'Pearl cream', hex: '#f0e9d5' },
  { name: 'Arctic silver', hex: '#b8bec4' },
  { name: 'Graphite', hex: '#62666a' },
  { name: 'Piano black', hex: '#151716' },
  { name: 'Champagne', hex: '#b4a086' },
  { name: 'Burnt copper', hex: '#a96746' },
  { name: 'Signal red', hex: '#af222b' },
  { name: 'Burgundy', hex: '#6e2d3c' },
  { name: 'Electric orange', hex: '#ee6a1c' },
  { name: 'Sunburst yellow', hex: '#f2c81a' },
  { name: 'Olive', hex: '#777b58' },
  { name: 'Racing green', hex: '#284b3e' },
  { name: 'Sky blue', hex: '#5fa9de' },
  { name: 'Slate blue', hex: '#637c8f' },
  { name: 'Midnight blue', hex: '#263c59' },
  { name: 'Royal purple', hex: '#5a2f8a' },
  { name: 'Dusty rose', hex: '#b38a8b' },
];
const PLAY_MATERIALS = [
  'gloss',
  'metallic',
  'pearl',
  'satin',
  'satin-metallic',
  'matte',
  'matte-metallic',
  'liquid-metal',
  'brushed',
  'carbon',
];
const PAINTED = ['body', 'hood', 'roof', 'mirrors'];
// Signature design: ivory body, piano-black roof and mirrors, champagne details.
const DEFAULT_FILMS = {
  body: '3m-g79-gloss',
  hood: '3m-g79-gloss',
  roof: 'skyfol-piano-black',
  mirrors: 'skyfol-piano-black',
  wheels: 'skyfol-piano-black',
  accents: 'skyfol-champagne-gold',
};
const STORAGE_KEY = 'noir-wrap-design-v1';
const $ = (selector) => document.querySelector(selector);
const getPartName = (id) => t(PARTS.find((part) => part.id === id).label);
const validHex = (value) =>
  typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);
const whatsappUrl = (text) =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
const getMaterialName = (material) => t(MATERIALS[material]?.label ?? 'Gloss');
const filmFinish = (film) => getMaterialName(film.material);

function designFromFilms(films) {
  const design = { films: {}, colors: {}, materials: {} };
  for (const { id } of PARTS) {
    const film = FILM_BY_ID.get(films[id]);
    design.films[id] = film.id;
    design.colors[id] = film.hex;
    design.materials[id] = film.material;
  }
  return design;
}

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
let state = {
  vehicle: 'bmw',
  ...designFromFilms(DEFAULT_FILMS),
};
let selectedPart = 'body';
let filmMaker = 'all';
let filmGroup = 'all';
let filmQuery = '';
let scene;
let toastTimer;
let currentToast;
let storageWarning = false;
let autoRotate = false;
let searchQuery = '';
let availableParts = new Set(PARTS.map(({ id }) => id));
let generatedVehicle = '';
let requestResult = null;
let sendingRequest = false;
let revealedBrand = '';
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

function notify(key, params = {}) {
  currentToast = { key, params };
  const toast = $('#toast');
  toast.textContent = t(key, params);
  toast.classList.add('visible');
  scheduleWhatsappYield();
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove('visible');
    scheduleWhatsappYield();
  }, 6000);
}

// Accepts the current format ({films, colors, materials}) and the earlier one
// ({colors, finish}) so saved designs and shared links keep working.
function validateDesign(value) {
  if (
    !value ||
    typeof value !== 'object' ||
    !VEHICLES.some((vehicle) => vehicle.id === value.vehicle) ||
    !value.colors
  )
    return null;
  const design = {
    vehicle: value.vehicle,
    films: {},
    colors: {},
    materials: {},
  };
  for (const { id } of PARTS) {
    const film = FILM_BY_ID.get(value.films?.[id]);
    if (film) {
      design.films[id] = film.id;
      design.colors[id] = film.hex;
      design.materials[id] = film.material;
      continue;
    }
    const material = value.materials?.[id] ?? value.finish;
    if (!validHex(value.colors[id]) || !MATERIALS[material]) return null;
    design.films[id] = '';
    design.colors[id] = value.colors[id].toLowerCase();
    design.materials[id] = material;
  }
  return design;
}

function restoreDesign() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('vehicle')) {
    // Each part is a film id, or "<hex>" / "<hex>~<material>" for custom shades.
    const films = {};
    const colors = {};
    const materials = {};
    for (const { id } of PARTS) {
      const value = params.get(id) ?? '';
      if (FILM_BY_ID.has(value)) films[id] = value;
      else {
        const [hex, material] = value.split('~');
        colors[id] = `#${hex}`;
        materials[id] = material ?? params.get('finish');
      }
    }
    const shared = validateDesign({
      vehicle: params.get('vehicle'),
      films,
      colors,
      materials,
    });
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

function designUrl() {
  const url = new URL(window.location.href);
  url.search = '';
  url.searchParams.set('vehicle', state.vehicle);
  PARTS.forEach(({ id }) =>
    url.searchParams.set(
      id,
      state.films[id] || `${state.colors[id].slice(1)}~${state.materials[id]}`,
    ),
  );
  url.hash = 'configurator';
  return url.href;
}

function syncAddress() {
  // Keep an opened shared link in sync with later edits without adding history entries.
  if (!new URLSearchParams(window.location.search).has('vehicle')) return;
  history.replaceState(null, '', designUrl());
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
  document.querySelectorAll('[data-film]').forEach((button) => {
    const active = button.dataset.film === film;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('[data-color]').forEach((button) => {
    const active = !film && button.dataset.color === color;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('[data-play-material]').forEach((button) => {
    const active =
      !film && button.dataset.playMaterial === state.materials[selectedPart];
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('[data-film-group]').forEach((button) => {
    const active = button.dataset.filmGroup === filmGroup;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
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
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'instant'
      : 'smooth',
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
  scene?.setColors(state.colors, state.materials, flipColors());
  updateControls();
  layout.schedule(SETTLE_MS, $('#configurator'));
  persistDesign();
  syncAddress();
}

function flipColors() {
  return Object.fromEntries(
    PARTS.map(({ id }) => [id, FILM_BY_ID.get(state.films[id])?.flip]).filter(
      ([, flip]) => flip,
    ),
  );
}

// Orders films like a colour fan deck: whites → greys → blacks, then the hue
// wheel (red → yellow → green → blue → purple → pink), light to dark in each.
function colourSortKey({ hex }) {
  const [r, g, b] = [1, 3, 5].map(
    (i) => parseInt(hex.slice(i, i + 2), 16) / 255,
  );
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const light = (max + min) / 2;
  const chroma = max - min;
  if (chroma < 0.08 || (light < 0.12 && chroma < 0.12)) return [0, 0, -light];
  let hue =
    max === r
      ? ((g - b) / chroma + 6) % 6
      : max === g
        ? (b - r) / chroma + 2
        : (r - g) / chroma + 4;
  hue *= 60;
  if (hue >= 345) hue -= 360;
  return [1, Math.floor((hue + 15) / 24), -light];
}
const FILMS_BY_COLOUR_ORDER = FILMS.map((film) => [colourSortKey(film), film])
  .sort(([a], [b]) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2])
  .map(([, film]) => film);

function matchingFilms() {
  const group = MATERIAL_GROUPS.find(({ id }) => id === filmGroup);
  const words = filmQuery.split(/\s+/).filter(Boolean);
  return FILMS_BY_COLOUR_ORDER.filter((film) => {
    if (filmMaker !== 'all' && film.maker !== filmMaker) return false;
    if (group?.materials && !group.materials.includes(film.material))
      return false;
    const text =
      `${film.maker} ${film.range} ${film.name} ${film.code} ${film.finish}`.toLowerCase();
    return words.every((word) => text.includes(word));
  });
}

function filmCountText() {
  const count = matchingFilms().length;
  return t(count === 1 ? '{count} film' : '{count} films', { count });
}

// CSS preview of the film: sheen for metallics, weave for carbon, split for flips.
function swatchBackground(film) {
  const base = film.hex;
  switch (film.material) {
    case 'carbon':
      return `repeating-linear-gradient(45deg, ${base} 0 3px, #000 3px 4px, ${base} 4px 7px), ${base}`;
    case 'brushed':
      return `repeating-linear-gradient(0deg, rgba(255,255,255,.18) 0 1px, transparent 1px 3px), linear-gradient(135deg, ${base}, #fff3 50%, ${base})`;
    case 'flip':
    case 'satin-flip':
      return `linear-gradient(135deg, ${base} 30%, ${film.flip ?? '#7a5cff'} 100%)`;
    case 'pearl':
    case 'satin-pearl':
      return `linear-gradient(135deg, ${base} 40%, #f3e9ff 60%, ${base})`;
    case 'matte':
    case 'textured':
      return base;
    default:
      return MATERIALS[film.material]?.metalness > 0.3
        ? `linear-gradient(135deg, ${base} 35%, #ffffff66 55%, ${base} 75%)`
        : `linear-gradient(160deg, #ffffff40, transparent 45%), ${base}`;
  }
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

function filmColourKey(film) {
  return `${film.maker}|${film.name
    .toLowerCase()
    .replace(/\s+-\s+o$|\s+eu$/g, '')
    .replace(/^(high gloss|gloss|satin|matte?|sm|s)\s+/, '')
    .trim()}`;
}
const FILMS_BY_COLOUR = new Map();
for (const film of FILMS) {
  const key = filmColourKey(film);
  if (!FILMS_BY_COLOUR.has(key)) FILMS_BY_COLOUR.set(key, []);
  const siblings = FILMS_BY_COLOUR.get(key);
  if (!siblings.some(({ material }) => material === film.material))
    siblings.push(film);
}
// The finishes the studio actually stocks for this exact colour.
const filmVariants = (film) => FILMS_BY_COLOUR.get(filmColourKey(film));

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

function setFilm(id) {
  const film = FILM_BY_ID.get(id);
  if (!film) return;
  const parts = $('#apply-all').checked
    ? [...new Set([...PAINTED, selectedPart])]
    : [selectedPart];
  for (const part of parts) {
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
  const parts = $('#apply-all').checked
    ? [...new Set([...PAINTED, selectedPart])]
    : [selectedPart];
  for (const part of parts) {
    state.films[part] = '';
    state.colors[part] = color;
    state.materials[part] = material;
  }
  applyDesign();
}

function downloadFile(content, type, filename) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function updateBriefSummary() {
  const vehicle = VEHICLES.find((item) => item.id === state.vehicle);
  $('#brief-summary').textContent = t(
    '{vehicle} · {finish} finish · Body: {body} · Roof / rear deck: {roof}',
    {
      vehicle: `${vehicle.brand} ${vehicle.model}`,
      finish: getMaterialName(state.materials.body),
      body: describePart('body'),
      roof: describePart('roof'),
    },
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

function openConsult(service = '') {
  const vehicle = VEHICLES.find((item) => item.id === state.vehicle);
  generatedVehicle = t('{vehicle} (add model year)', {
    vehicle: `${vehicle.brand} ${vehicle.model}`,
  });
  $('#consult-vehicle').value = generatedVehicle;
  if (SERVICES.includes(service))
    $('#consult-form').querySelector(
      `[name="services"][value="${service}"]`,
    ).checked = true;
  updateBriefSummary();
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
    notes: text('notes'),
    honey: text('_honey'),
    preview: `${vehicle.brand} ${vehicle.model}`,
    link: designUrl(),
  };
}

// The customer's real car first; the site model is only the design preview.
function vehicleFields(request) {
  if (!request.ownCar)
    return [
      [t('Actual vehicle'), request.vehicle],
      [t('Preview vehicle'), request.preview],
    ];
  return [
    [
      t('Vehicle'),
      t('{car} (preview shown on: {model})', {
        car: request.ownCar,
        model: request.preview,
      }),
    ],
  ];
}

// The request as [label, value] pairs in the active language, shared by the
// WhatsApp message and the email.
function requestFields(request) {
  return [
    [t('Name'), request.name],
    [t('Email'), request.email],
    [t('Phone'), request.phone || '—'],
    ...vehicleFields(request).slice(0, 1),
    [
      t('Services'),
      request.services.map((service) => t(service)).join(', ') ||
        t('Not specified'),
    ],
    ...vehicleFields(request).slice(1),
    ...PARTS.filter(({ id }) => availableParts.has(id)).map(({ id, label }) => [
      t(label),
      `${describePartFull(id)} (${state.colors[id].toUpperCase()})`,
    ]),
    [t('Project notes'), request.notes || t('No additional notes.')],
    [t('Design link'), request.link],
  ];
}

function whatsappMessage(fields) {
  return [
    t("Hello Elite Custom Wrap! I'd like a consultation for my car."),
    '',
    ...fields.map(([label, value]) => `*${label}:* ${value}`),
  ].join('\n');
}

function validateRequest(form) {
  const field = (name) => form.elements.namedItem(name);
  const checks = [
    [field('name'), (value) => value.length >= 2, 'Please enter your name.'],
    [
      field('email'),
      (value, input) =>
        input.validity.valid && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value),
      'Please enter a valid email address.',
    ],
    [
      field('phone'),
      (value) =>
        !value ||
        (/^\+?[\d\s().-]{6,24}$/.test(value) &&
          value.replace(/\D/g, '').length >= 6),
      'Please enter a valid phone number, or leave it empty.',
    ],
    [
      field('vehicle'),
      (value, input) => input.disabled || value.length >= 2,
      'Please describe your vehicle.',
    ],
    [
      field('ownCar'),
      (value, input) => input.disabled || value.length >= 2,
      "Please enter your car's make, model and year.",
    ],
  ];
  let firstInvalid = null;
  for (const [input, valid, message] of checks) {
    input.setCustomValidity('');
    if (!valid(input.value.trim(), input)) {
      input.setCustomValidity(t(message));
      firstInvalid ??= input;
    }
  }
  if (!firstInvalid) return true;
  firstInvalid.focus();
  firstInvalid.reportValidity();
  return false;
}

// FormSubmit relays the JSON to CONTACT.email. The first submission to a new
// address triggers FormSubmit's one-time activation email; until the address
// owner confirms it, requests are not delivered.
async function sendRequestEmail(request, fields) {
  if (!CONTACT.email) return 'skipped';
  const response = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(CONTACT.email)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        _subject: t('New wrap request from {name}', { name: request.name }),
        _template: 'table',
        _captcha: 'false',
        _replyto: request.email,
        _honey: request.honey,
        ...Object.fromEntries(fields),
        [t('Language')]: languages[getLocale()],
      }),
      signal: AbortSignal.timeout(15000),
    },
  );
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const result = await response.json().catch(() => ({}));
  if (String(result.success) !== 'true')
    throw new Error(result.message || 'not accepted');
  return 'sent';
}

function openWhatsapp(url) {
  let popup = null;
  try {
    popup = window.open(url, '_blank');
  } catch (error) {
    console.warn('WhatsApp could not open in a new tab:', error);
  }
  // Equivalent to rel="noopener"; "noopener" in window.open would hide
  // whether a popup blocker stopped the tab.
  if (popup)
    try {
      popup.opener = null;
    } catch {
      // The new tab has already navigated cross-origin.
    }
  return popup;
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
  const request = collectRequest();
  const lines = [
    t('ELITE CUSTOM WRAP / CONSULTATION BRIEF'),
    `${t('Created')}: ${new Date().toLocaleDateString(getLocale())}`,
    '',
    `${t('Name')}: ${request.name}`,
    `${t('Email')}: ${request.email}`,
    `${t('Phone')}: ${request.phone || '—'}`,
    ...vehicleFields(request)
      .slice(0, 1)
      .map(([label, value]) => `${label}: ${value}`),
    `${t('Services')}: ${request.services.map((service) => t(service)).join(', ') || t('Not specified')}`,
    '',
    ...vehicleFields(request)
      .slice(1)
      .map(([label, value]) => `${label}: ${value}`),
    ...PARTS.map(
      ({ id, label }) =>
        `${t(label)}: ${describePartFull(id)} (${state.colors[id]})`,
    ),
    '',
    t('Project notes:'),
    request.notes || t('No additional notes.'),
    '',
    t('Reopen design:'),
    request.link,
    '',
    t('This is a visual concept, not a confirmed booking or quote.'),
    t(
      'Actual vinyl colors, bodywork, and suitability must be confirmed with physical samples.',
    ),
    t(
      'Wheel color is a styling reference; discuss the appropriate refinishing method.',
    ),
    `WhatsApp: ${CONTACT.whatsappDisplay}`,
  ];
  downloadFile(
    lines.join('\r\n'),
    'text/plain;charset=utf-8',
    'elite-custom-wrap-consultation-brief.txt',
  );
  notify('Your consultation brief has been downloaded.');
}

// The floating WhatsApp button steps aside while it would cover essential
// controls or a notification, and returns once they scroll away.
const WHATSAPP_YIELD_TO = [
  '.vehicle-tabs',
  '.catalog-controls',
  '.view-tabs',
  '.stage-actions',
  '.panel-heading',
  '.design-panel .control-group',
  '.apply-all',
  '.design-cta',
  '.panel-footer',
  '.config-foot',
  '.service-card .text-link',
  '.faq summary',
  '.contact-actions',
  '.footer',
  '.toast.visible',
].join(', ');
let whatsappYieldFrame = 0;

const WHATSAPP_MAX_LIFT = 160;

// First tries lifting the button just above whatever it would cover; only when
// no clear spot is near does it fade away.
function updateWhatsappYield() {
  whatsappYieldFrame = 0;
  const float = $('#whatsapp-float');
  if (float.hidden || getComputedStyle(float).display === 'none') return;
  const style = getComputedStyle(float);
  const width = float.offsetWidth;
  const height = float.offsetHeight;
  const right = document.documentElement.clientWidth - parseFloat(style.right);
  const bottom =
    document.documentElement.clientHeight - parseFloat(style.bottom);
  const gap = 8;
  const rects = [...document.querySelectorAll(WHATSAPP_YIELD_TO)]
    .map((element) => element.getBoundingClientRect())
    .filter(
      (rect) =>
        rect.width > 0 && rect.left < right && rect.right > right - width,
    );
  const blockers = (lift) =>
    rects.filter(
      (rect) =>
        rect.top < bottom - lift + gap &&
        rect.bottom > bottom - lift - height - gap,
    );
  let lift = 0;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const blocking = blockers(lift);
    if (!blocking.length) break;
    lift = bottom - Math.min(...blocking.map((rect) => rect.top)) + gap;
  }
  const clear = lift <= WHATSAPP_MAX_LIFT && !blockers(lift).length;
  float.style.setProperty('--lift', `${clear ? -lift : 0}px`);
  float.classList.toggle('is-yielding', !clear);
}

function scheduleWhatsappYield() {
  if (!whatsappYieldFrame)
    whatsappYieldFrame = requestAnimationFrame(updateWhatsappYield);
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
$('#language-select').value = getLocale();
restoreDesign();
$('#year').textContent = new Date().getFullYear();
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
window.addEventListener('resize', () => {
  updateBrandOverflow();
  scheduleWhatsappYield();
});
window.addEventListener('scroll', scheduleWhatsappYield, { passive: true });
// Late layout changes (fonts, reserved language sizes, models) move controls
// without scrolling.
const whatsappLayoutObserver = new ResizeObserver(scheduleWhatsappYield);
['body', '.config-layout', '.design-panel'].forEach((selector) =>
  whatsappLayoutObserver.observe($(selector)),
);
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
    scene.setColors(state.colors, state.materials, flipColors());
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
    document.querySelectorAll('[data-view]').forEach((viewButton) => {
      const active = button === viewButton;
      viewButton.classList.toggle('active', active);
      viewButton.setAttribute('aria-pressed', String(active));
    });
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
  document.querySelectorAll('[data-view]').forEach((button) => {
    const active = button.dataset.view === 'perspective';
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
});
$('#reset-design').addEventListener('click', () => {
  state = {
    vehicle: 'bmw',
    ...designFromFilms(DEFAULT_FILMS),
  };
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
$('#close-dialog').addEventListener('click', () =>
  $('#consult-dialog').close(),
);
$('#close-share').addEventListener('click', () => $('#share-dialog').close());
document.querySelectorAll('dialog').forEach((dialog) => {
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom)
    )
      dialog.close();
  });
});
$('#consult-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (sendingRequest || !validateRequest(form)) return;
  sendingRequest = true;
  const submit = form.querySelector('[type="submit"]');
  submit.disabled = true;
  form.setAttribute('aria-busy', 'true');
  const request = collectRequest();
  const fields = requestFields(request);
  const url = whatsappUrl(whatsappMessage(fields));
  $('#request-whatsapp').href = url;
  // Opened inside the submit gesture so popup blockers allow the tab.
  const popup = openWhatsapp(url);
  let email = 'skipped';
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
$('#consult-form').addEventListener('change', (event) => {
  if (event.target.name === 'carMatch') updateCarMatch({ focus: true });
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
$('#credit-button').addEventListener('click', () => {
  $('#credit-dialog').showModal();
  layout.measure($('#credit-dialog'));
});
$('#close-credit').addEventListener('click', () => $('#credit-dialog').close());
$('#whatsapp-float-close').addEventListener('click', () => {
  // Hidden for this page view only; a reload shows it again.
  $('#whatsapp-float').hidden = true;
});
$('#share-design').addEventListener('click', () => {
  $('#share-url').value = designUrl();
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
const presets = {
  monochrome: DEFAULT_FILMS,
  stealth: {
    body: 'avery-la8300001-matte',
    hood: 'avery-la8300001-matte',
    roof: 'avery-la8300001-matte',
    mirrors: 'avery-la8300001-matte',
    wheels: 'avery-lb5300001-matte-metallic',
    accents: 'avery-lb5300001-matte-metallic',
  },
  green: {
    body: 'avery-cb1500001-gloss',
    hood: 'avery-cb1500001-gloss',
    roof: 'skyfol-piano-black',
    mirrors: 'avery-cb1500001-gloss',
    wheels: 'skyfol-champagne-gold',
    accents: 'skyfol-champagne-gold',
  },
};
document.querySelectorAll('[data-preset]').forEach((button) => {
  button.addEventListener('click', () => {
    state = {
      vehicle: state.vehicle,
      ...designFromFilms(presets[button.dataset.preset]),
    };
    selectedPart = 'body';
    applyDesign();
    $('#configurator').scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
    notify('Signature palette loaded. Make it your own.');
  });
});
$('.menu-toggle').addEventListener('click', () => {
  const expanded = $('.menu-toggle').getAttribute('aria-expanded') === 'true';
  $('.menu-toggle').setAttribute('aria-expanded', String(!expanded));
  $('.menu-toggle').setAttribute(
    'aria-label',
    t(expanded ? 'Open navigation' : 'Close navigation'),
  );
  $('#mobile-nav').hidden = expanded;
  layout.measure($('#mobile-nav'));
});
$('#mobile-nav').addEventListener('click', (event) => {
  if (event.target.closest('a, button')) {
    $('#mobile-nav').hidden = true;
    $('.menu-toggle').setAttribute('aria-expanded', 'false');
    $('.menu-toggle').setAttribute('aria-label', t('Open navigation'));
  }
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
  $('.menu-toggle').setAttribute(
    'aria-label',
    t($('#mobile-nav').hidden ? 'Open navigation' : 'Close navigation'),
  );
  if ($('#consult-dialog').open) {
    const vehicle = VEHICLES.find((item) => item.id === state.vehicle);
    generatedVehicle = t('{vehicle} (add model year)', {
      vehicle: `${vehicle.brand} ${vehicle.model}`,
    });
    if (replaceVehicle) $('#consult-vehicle').value = generatedVehicle;
    updateBriefSummary();
  }
  if (currentToast && $('#toast').classList.contains('visible')) {
    $('#toast').textContent = t(currentToast.key, currentToast.params);
  }
});
window.addEventListener('pagehide', (event) => {
  if (!event.persisted) scene?.dispose();
});
updateBrandOverflow();
scheduleWhatsappYield();

// Reveal the page once text is translated and the brand font is ready.
Promise.race([
  document.fonts?.ready,
  new Promise((resolve) => setTimeout(resolve, 1500)),
]).then(() =>
  requestAnimationFrame(() => {
    const skeleton = $('#page-skeleton');
    skeleton.classList.add('is-done');
    setTimeout(() => skeleton.remove(), 600);
  }),
);

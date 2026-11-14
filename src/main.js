import { createCarScene, VEHICLES, PARTS } from './car-scene.js';
import { BRANDS } from './vehicles.js';
import {
  captureStaticTranslations,
  getLocale,
  languages,
  setLocale,
  t,
} from './i18n.js';
import { createLayoutStability, SETTLE_MS } from './layout-stability.js';

const COLORS = [
  { name: 'Bone white', hex: '#e8e2d6' },
  { name: 'Piano black', hex: '#151716' },
  { name: 'Graphite', hex: '#62666a' },
  { name: 'Champagne', hex: '#b4a086' },
  { name: 'Racing green', hex: '#284b3e' },
  { name: 'Midnight blue', hex: '#263c59' },
  { name: 'Burgundy', hex: '#6e2d3c' },
  { name: 'Arctic silver', hex: '#b8bec4' },
  { name: 'Pearl cream', hex: '#f0e9d5' },
  { name: 'Burnt copper', hex: '#a96746' },
  { name: 'Signal red', hex: '#af222b' },
  { name: 'Slate blue', hex: '#637c8f' },
  { name: 'Olive', hex: '#777b58' },
  { name: 'Dusty rose', hex: '#b38a8b' },
];
const FINISHES = ['gloss', 'satin', 'matte'];
const DEFAULT_COLORS = {
  body: '#e8e2d6',
  hood: '#e8e2d6',
  roof: '#151716',
  mirrors: '#151716',
  wheels: '#151716',
  accents: '#b4a086',
};
const STORAGE_KEY = 'noir-wrap-design-v1';
const $ = (selector) => document.querySelector(selector);
const titleCase = (value) => value.charAt(0).toUpperCase() + value.slice(1);
const getColorName = (hex) => {
  const color = COLORS.find((item) => item.hex === hex);
  return color ? t(color.name) : t('Custom {hex}', { hex: hex.toUpperCase() });
};
const getFinishName = (finish) => t(titleCase(finish));
const getPartName = (id) => t(PARTS.find((part) => part.id === id).label);
const validHex = (value) =>
  typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);
let state = {
  vehicle: 'bmw',
  finish: 'gloss',
  colors: { ...DEFAULT_COLORS },
};
let selectedPart = 'body';
let scene;
let toastTimer;
let currentToast;
let storageWarning = false;
let autoRotate = false;
let searchQuery = '';
let availableParts = new Set(PARTS.map(({ id }) => id));
let generatedVehicle = '';
let generatedNotes = '';
let consultService = '';
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
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 6000);
}

function validateDesign(value) {
  if (
    !value ||
    typeof value !== 'object' ||
    !VEHICLES.some((vehicle) => vehicle.id === value.vehicle) ||
    !FINISHES.includes(value.finish) ||
    !value.colors ||
    !PARTS.every((part) => validHex(value.colors[part.id]))
  )
    return null;
  return {
    vehicle: value.vehicle,
    finish: value.finish,
    colors: Object.fromEntries(
      PARTS.map(({ id }) => [id, value.colors[id].toLowerCase()]),
    ),
  };
}

function restoreDesign() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('vehicle')) {
    const shared = validateDesign({
      vehicle: params.get('vehicle'),
      finish: params.get('finish'),
      colors: Object.fromEntries(
        PARTS.map(({ id }) => [id, `#${params.get(id) ?? ''}`]),
      ),
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
  url.searchParams.set('finish', state.finish);
  PARTS.forEach(({ id }) =>
    url.searchParams.set(id, state.colors[id].slice(1)),
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
  document.querySelectorAll('[data-color]').forEach((button) => {
    const active = button.dataset.color === color;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
    const colorName = getColorName(button.dataset.color);
    button.setAttribute('aria-label', `${colorName}, ${button.dataset.color}`);
    button.title = colorName;
  });
  document.querySelectorAll('[data-finish]').forEach((button) => {
    const active = button.dataset.finish === state.finish;
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
  const color = state.colors[selectedPart];
  const render = (selector, text) => {
    const element = $(selector);
    if (root.contains(element)) element.textContent = text;
  };
  render('#vehicle-type', `${t(vehicle.type)} / ${t('Wrap preview')}`);
  render('#color-label', getColorName(color));
  render(
    '#selection-summary',
    `${getColorName(color)} / ${getFinishName(state.finish)}`,
  );
  render('#catalog-count', catalogCountText());
  if ($('#consult-dialog').open && root.contains($('#brief-summary')))
    updateBriefSummary();
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
  scene?.setColors(state.colors, state.finish);
  updateControls();
  layout.schedule(SETTLE_MS, $('#configurator'));
  persistDesign();
  syncAddress();
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

function setColor(color) {
  if (!validHex(color)) {
    notify('Please choose a valid six-digit color.');
    return;
  }
  if ($('#apply-all').checked) {
    ['body', 'hood', 'roof', 'mirrors'].forEach((part) => {
      state.colors[part] = color;
    });
    state.colors[selectedPart] = color;
  } else state.colors[selectedPart] = color;
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
      finish: getFinishName(state.finish),
      body: getColorName(state.colors.body),
      roof: getColorName(state.colors.roof),
    },
  );
}

function openConsult(service = '') {
  const vehicle = VEHICLES.find((item) => item.id === state.vehicle);
  const notesWereGenerated =
    generatedNotes && $('#consult-notes').value === generatedNotes;
  consultService = service;
  generatedVehicle = t('{vehicle} (add model year)', {
    vehicle: `${vehicle.brand} ${vehicle.model}`,
  });
  $('#consult-vehicle').value = generatedVehicle;
  generatedNotes = service
    ? `${t('Interested in: {service}.', { service: t(service) })}\n`
    : '';
  if (service || notesWereGenerated) $('#consult-notes').value = generatedNotes;
  updateBriefSummary();
  $('#consult-form').hidden = false;
  $('#brief-success').hidden = true;
  $('#consult-dialog').showModal();
  layout.measure($('#consult-dialog'));
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
COLORS.forEach(({ name, hex }) => {
  const button = document.createElement('button');
  button.className = 'swatch';
  button.dataset.color = hex;
  button.style.setProperty('--swatch-color', hex);
  button.setAttribute('aria-label', `${name}, ${hex}`);
  button.title = name;
  button.addEventListener('click', () => setColor(hex));
  $('#swatches').append(button);
});

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
        `${vehicle.brand} ${vehicle.model} · CC BY 4.0.`;
      layout.schedule(0, $('#configurator'));
    },
  });
  scene.setVehicle(state.vehicle);
  scene.setColors(state.colors, state.finish);
} catch (error) {
  showSceneError(error);
}
updateControls();

$('#part-select').addEventListener('change', (event) =>
  selectPart(event.target.value),
);
$('#custom-color').addEventListener('input', (event) =>
  setColor(event.target.value),
);
document.querySelectorAll('[data-finish]').forEach((button) => {
  button.addEventListener('click', () => {
    state.finish = button.dataset.finish;
    applyDesign();
  });
});
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
    finish: 'gloss',
    colors: { ...DEFAULT_COLORS },
  };
  selectedPart = 'body';
  $('#apply-all').checked = false;
  applyDesign({ vehicleChanged: true });
  notify('Your design has been reset to the signature palette.');
});
$('#download-preview').addEventListener('click', () => {
  try {
    scene?.download(`elite-custom-wrap-${state.vehicle}-${state.finish}.png`);
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
$('#consult-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const lines = [
    t('ELITE CUSTOM WRAP / CONSULTATION BRIEF'),
    `${t('Created')}: ${new Date().toLocaleDateString(getLocale())}`,
    '',
    `${t('Name')}: ${data.get('name')}`,
    `${t('Email')}: ${data.get('email')}`,
    `${t('Actual vehicle')}: ${data.get('vehicle')}`,
    '',
    `${t('Preview vehicle')}: ${VEHICLES.find(({ id }) => id === state.vehicle).brand} ${VEHICLES.find(({ id }) => id === state.vehicle).model}`,
    `${t('Finish')}: ${getFinishName(state.finish)}`,
    ...PARTS.map(
      ({ id, label }) =>
        `${t(label)}: ${getColorName(state.colors[id])} (${state.colors[id]})`,
    ),
    '',
    t('Project notes:'),
    String(data.get('notes') || t('No additional notes.')),
    '',
    t('Reopen design:'),
    designUrl(),
    '',
    t('This is a visual concept, not a confirmed booking or quote.'),
    t(
      'Actual vinyl colors, bodywork, and suitability must be confirmed with physical samples.',
    ),
    t(
      'Wheel color is a styling reference; discuss the appropriate refinishing method.',
    ),
    t('No request has been sent. Share this file with the business directly.'),
  ];
  downloadFile(
    lines.join('\r\n'),
    'text/plain;charset=utf-8',
    'elite-custom-wrap-consultation-brief.txt',
  );
  $('#consult-form').hidden = true;
  $('#brief-success').hidden = false;
  layout.measure($('#consult-dialog'));
  $('#brief-success a').focus();
});
$('#edit-brief').addEventListener('click', () => {
  $('#consult-form').hidden = false;
  $('#brief-success').hidden = true;
  layout.measure($('#consult-dialog'));
  $('#consult-form input').focus();
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
  monochrome: { finish: 'gloss', colors: { ...DEFAULT_COLORS } },
  stealth: {
    finish: 'matte',
    colors: {
      body: '#151716',
      hood: '#151716',
      roof: '#151716',
      mirrors: '#151716',
      wheels: '#62666a',
      accents: '#62666a',
    },
  },
  green: {
    finish: 'satin',
    colors: {
      body: '#284b3e',
      hood: '#284b3e',
      roof: '#151716',
      mirrors: '#284b3e',
      wheels: '#b4a086',
      accents: '#b4a086',
    },
  },
};
document.querySelectorAll('[data-preset]').forEach((button) => {
  button.addEventListener('click', () => {
    const preset = presets[button.dataset.preset];
    state.finish = preset.finish;
    state.colors = { ...preset.colors };
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
  const replaceNotes =
    consultService && $('#consult-notes').value === generatedNotes;
  setLocale(event.target.value);
  translateStatic();
  updateControls();
  scene?.translateLoading();
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
    generatedNotes = consultService
      ? `${t('Interested in: {service}.', { service: t(consultService) })}\n`
      : '';
    if (replaceVehicle) $('#consult-vehicle').value = generatedVehicle;
    if (replaceNotes) $('#consult-notes').value = generatedNotes;
    updateBriefSummary();
  }
  if (currentToast && $('#toast').classList.contains('visible')) {
    $('#toast').textContent = t(currentToast.key, currentToast.params);
  }
});
window.addEventListener('pagehide', (event) => {
  if (!event.persisted) scene?.dispose();
});

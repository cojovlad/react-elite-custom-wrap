// Consultation requests: validation, the WhatsApp message, the email copy and
// the downloadable brief.
import { CONTACT } from './config.js';
import { getLocale, languages, t } from './i18n.js';
import { sizeLabel } from './pricing.js';

export const SERVICES = [
  'Color change wrap',
  'Paint protection film',
  'Front PPF',
  'Chrome delete',
  'Bespoke details',
];

export const whatsappUrl = (text) =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

export const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
export const isValidPhone = (value) =>
  !value ||
  (/^\+?[\d\s().-]{6,24}$/.test(value) && value.replace(/\D/g, '').length >= 6);

export function validateRequest(form) {
  const field = (name) => form.elements.namedItem(name);
  const checks = [
    [field('name'), (value) => value.length >= 2, 'Please enter your name.'],
    [
      field('email'),
      (value, input) => input.validity.valid && isValidEmail(value),
      'Please enter a valid email address.',
    ],
    [
      field('phone'),
      isValidPhone,
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

// The customer's real car first; the site model is only the design preview.
export function vehicleFields(request) {
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

// Vehicle size, the price estimate and its per-service breakdown, when known.
const sizeFields = (request) =>
  request.size ? [[t('Vehicle size'), t(sizeLabel(request.size))]] : [];
const estimateFields = (request) => [
  ...(request.estimate ? [[t('Estimate'), request.estimate]] : []),
  ...(request.breakdown ? [[t('Estimate breakdown'), request.breakdown]] : []),
];

const servicesText = (request) =>
  request.services.map((service) => t(service)).join(', ') ||
  t('Not specified');

// The request as [label, value] pairs in the active language, shared by the
// WhatsApp message and the email. partFields are [label, value] per surface.
export function requestFields(request, partFields) {
  return [
    [t('Name'), request.name],
    [t('Email'), request.email],
    [t('Phone'), request.phone || '—'],
    ...vehicleFields(request).slice(0, 1),
    ...sizeFields(request),
    [t('Services'), servicesText(request)],
    ...estimateFields(request),
    ...vehicleFields(request).slice(1),
    ...partFields,
    [t('Project notes'), request.notes || t('No additional notes.')],
    [t('Design link'), request.link],
  ];
}

export function whatsappMessage(fields) {
  return [
    t("Hello Elite Custom Wrap! I'd like a consultation for my car."),
    '',
    ...fields.map(([label, value]) => `*${label}:* ${value}`),
  ].join('\n');
}

// FormSubmit relays the JSON to CONTACT.email. The first submission to a new
// address triggers FormSubmit's one-time activation email; until the address
// owner confirms it, requests are not delivered.
export async function sendRequestEmail(request, fields) {
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

export function openWhatsapp(url) {
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

// The plain-text consultation brief. partLines are "Label: value" per surface.
export function briefLines(request, partLines, created = new Date()) {
  return [
    t('ELITE CUSTOM WRAP / CONSULTATION BRIEF'),
    `${t('Created')}: ${created.toLocaleDateString(getLocale())}`,
    '',
    `${t('Name')}: ${request.name}`,
    `${t('Email')}: ${request.email}`,
    `${t('Phone')}: ${request.phone || '—'}`,
    ...vehicleFields(request)
      .slice(0, 1)
      .map(([label, value]) => `${label}: ${value}`),
    ...[...sizeFields(request), [t('Services'), servicesText(request)]].map(
      ([label, value]) => `${label}: ${value}`,
    ),
    ...estimateFields(request).map(([label, value]) => `${label}: ${value}`),
    '',
    ...vehicleFields(request)
      .slice(1)
      .map(([label, value]) => `${label}: ${value}`),
    ...partLines,
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
}

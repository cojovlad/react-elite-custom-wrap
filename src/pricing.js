// Price list logic: vehicle sizes, which price line a film belongs to and the
// request estimate. Pure functions only, so they can be unit tested.
import { PRICE_LINES } from './price-list.js';

// Examples are model names, so they stay the same in every language.
export const SIZES = [
  {
    id: 'compact',
    label: 'Compact',
    examples: 'VW Golf · Audi A3 · Renault Clio',
  },
  {
    id: 'sedan',
    label: 'Saloon / Estate',
    examples: 'BMW i4 · Audi A6 · Tesla Model 3',
  },
  { id: 'suv', label: 'SUV', examples: 'BMW X1 · VW ID.4 · Porsche Macan' },
  {
    id: 'luxury',
    label: 'Large SUV / Luxury',
    examples: 'BMW X5 · Range Rover · Lamborghini',
  },
];
export const SIZE_IDS = SIZES.map(({ id }) => id);
export const sizeLabel = (id) => SIZES.find((size) => size.id === id).label;

export const PRICE_CATEGORIES = [
  {
    id: 'wrap',
    service: 'Color change wrap',
    title: 'Color change wrap',
    description:
      'Full-body colour change. Special films (colour flip, chrome, carbon, brushed or textured) are priced separately.',
  },
  {
    id: 'ppf',
    service: 'Paint protection film',
    title: 'Clear PPF',
    description: 'Invisible, self-healing protection for the whole body.',
  },
  {
    id: 'ppf-color',
    service: 'Color change wrap',
    title: 'Coloured PPF',
    description: 'A new colour and paint protection in a single film.',
  },
  {
    id: 'ppf-front',
    service: 'Front PPF',
    title: 'Front PPF',
    description:
      'Full bonnet, front bumper, front wings and mirrors. Headlights not included.',
  },
];

const linesOf = (category) =>
  PRICE_LINES.filter((line) => line.category === category);
export const priceLines = linesOf;

// Vehicle size by catalogue type; a few models do not follow their type.
const SIZE_BY_TYPE = {
  'City car': 'compact',
  'Family hatchback': 'compact',
  'Classic hatchback': 'compact',
  'Electric hatchback': 'compact',
  'Custom performance hatchback': 'compact',
  Saloon: 'sedan',
  'Compact saloon': 'sedan',
  'Sports saloon': 'sedan',
  'Electric saloon': 'sedan',
  'Performance estate': 'sedan',
  'Sports coupe': 'sedan',
  'Performance coupe': 'sedan',
  'Classic sports coupe': 'sedan',
  'Track-focused coupe': 'sedan',
  'Muscle coupe': 'sedan',
  'Sports car': 'sedan',
  'Compact SUV': 'suv',
  SUV: 'suv',
  'Electric SUV': 'suv',
  'Luxury SUV': 'luxury',
  'Luxury saloon': 'luxury',
  'Luxury coupe': 'luxury',
  'Luxury roadster': 'luxury',
  'Grand tourer': 'luxury',
  'Mid-engine sports coupe': 'luxury',
  Supercar: 'luxury',
  'Open-top supercar': 'luxury',
  'Custom supercar': 'luxury',
  Hypercar: 'luxury',
  'Hybrid hypercar': 'luxury',
  'GT racing car': 'luxury',
  'Historic racing car': 'luxury',
  Pickup: 'luxury',
  'Performance pickup': 'luxury',
};
const SIZE_BY_VEHICLE = {
  'porsche-macan': 'suv',
  'tesla-model-x': 'luxury',
  'mazda-mx5': 'compact',
};
export const vehicleSize = (vehicle) =>
  SIZE_BY_VEHICLE[vehicle.id] ?? SIZE_BY_TYPE[vehicle.type] ?? 'sedan';

// Textures and effects are special films; classic colours are standard.
export const SPECIAL_MATERIALS = new Set([
  'flip',
  'satin-flip',
  'diamond',
  'liquid-metal',
  'brushed',
  'carbon',
  'textured',
]);
const STANDARD_WRAP = ['oracal-970', 'avery-dennison-supreme', '3m-2080'];
const SPECIAL_WRAP = ['avery-special-colorflow', '3m-special-color-flip'];

// The price line of a studio film: [category, line id].
export function filmLine(film) {
  const special = SPECIAL_MATERIALS.has(film.material);
  if (film.maker === 'ORAFOL / ORACAL') return ['wrap', 'oracal-970'];
  if (film.maker === 'Avery Dennison')
    return ['wrap', special ? SPECIAL_WRAP[0] : STANDARD_WRAP[1]];
  if (film.maker === '3M')
    return ['wrap', special ? SPECIAL_WRAP[1] : STANDARD_WRAP[2]];
  if (film.maker === 'Carlass') return ['ppf-color', 'carlass-color-ppf'];
  if (film.maker === 'Skyfol') return ['ppf-color', 'skyfol-color-ppf'];
  return null;
}

const range = (lines, size) => {
  const prices = lines.map((line) => line.prices[size]);
  return { min: Math.min(...prices), max: Math.max(...prices) };
};
export const categoryRange = (category, size) => range(linesOf(category), size);

// The full-body wrap price for the design's body film. Free colours are
// matched to a real film later, so they get the range of their kind.
export function wrapEstimate(size, film, material) {
  if (film) {
    const [category, id] = filmLine(film);
    const line = PRICE_LINES.find(
      (item) => item.category === category && item.id === id,
    );
    const price = line.prices[size];
    return { min: price, max: price, category, line };
  }
  const ids = SPECIAL_MATERIALS.has(material) ? SPECIAL_WRAP : STANDARD_WRAP;
  return {
    ...range(
      linesOf('wrap').filter((line) => ids.includes(line.id)),
      size,
    ),
    category: 'wrap',
  };
}

// Services that depend on the car's trim and the chosen details, so the studio
// quotes them after seeing the car.
export const ON_REQUEST_SERVICES = ['Chrome delete', 'Bespoke details'];

// Estimate for the selected services, with one row per service. Coloured PPF
// already protects the whole body and full PPF already covers the front, so
// those rows are marked as included instead of being added twice.
export function requestEstimate({ size, services, film, material }) {
  const wrap = services.includes('Color change wrap')
    ? wrapEstimate(size, film, material)
    : null;
  const colouredPpf = wrap?.category === 'ppf-color';
  const fullPpf = services.includes('Paint protection film') && !colouredPpf;
  const rows = services.map((service) => {
    if (ON_REQUEST_SERVICES.includes(service))
      return { service, onRequest: true };
    if (service === 'Color change wrap')
      return {
        service,
        ...wrap,
        label: colouredPpf ? 'Coloured PPF' : service,
      };
    if (colouredPpf) return { service, includedIn: 'Coloured PPF' };
    if (service === 'Paint protection film')
      return { service, ...categoryRange('ppf', size) };
    if (fullPpf) return { service, includedIn: 'Paint protection film' };
    return { service, ...categoryRange('ppf-front', size) };
  });
  if (!rows.length) return null;
  const items = rows.filter((row) => row.min !== undefined);
  const onRequest = rows
    .filter((row) => row.onRequest)
    .map((row) => row.service);
  if (!items.length) return { rows, onRequest };
  return {
    min: items.reduce((sum, item) => sum + item.min, 0),
    max: items.reduce((sum, item) => sum + item.max, 0),
    items,
    onRequest,
    rows,
  };
}

export function formatPrice(value, locale) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
    useGrouping: 'always',
  }).format(value);
}

// "8.990" or "8.990 – 10.990", without the currency.
export const formatRange = ({ min, max }, locale) =>
  min === max
    ? formatPrice(min, locale)
    : `${formatPrice(min, locale)} – ${formatPrice(max, locale)}`;

// The design model: palettes, defaults, validation and the shareable link.
// Pure functions only, so they can be unit tested without a page.
import { VEHICLES } from './vehicles.js';
import { PARTS } from './parts.js';
import { FILMS } from './films.js';
import { MATERIALS } from './materials.js';

export const FILM_BY_ID = new Map(FILMS.map((film) => [film.id, film]));
// Free-play palette: any colour, any finish. The studio films are the exact
// stock colours and live in the collapsible catalogue below.
export const PLAY_COLORS = [
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
export const PLAY_MATERIALS = [
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
export const PAINTED = ['body', 'hood', 'roof', 'mirrors'];
// Signature design: ivory body, piano-black roof and mirrors, champagne details.
export const DEFAULT_FILMS = {
  body: '3m-g79-gloss',
  hood: '3m-g79-gloss',
  roof: 'skyfol-piano-black',
  mirrors: 'skyfol-piano-black',
  wheels: 'skyfol-piano-black',
  accents: 'skyfol-champagne-gold',
};
export const PRESETS = {
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
export const DEFAULT_VEHICLE = 'bmw';

export const validHex = (value) =>
  typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);

export function designFromFilms(films) {
  const design = { films: {}, colors: {}, materials: {} };
  for (const { id } of PARTS) {
    const film = FILM_BY_ID.get(films[id]);
    design.films[id] = film.id;
    design.colors[id] = film.hex;
    design.materials[id] = film.material;
  }
  return design;
}

export const defaultDesign = () => ({
  vehicle: DEFAULT_VEHICLE,
  ...designFromFilms(DEFAULT_FILMS),
});

// Accepts the current format ({films, colors, materials}) and the earlier one
// ({colors, finish}) so saved designs and shared links keep working.
export function validateDesign(value) {
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

// Reads a shared design link. Each part is a film id, or "<hex>" /
// "<hex>~<material>" for custom shades. Returns null for an invalid link.
export function designFromParams(params) {
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
  return validateDesign({
    vehicle: params.get('vehicle'),
    films,
    colors,
    materials,
  });
}

export function designUrl(href, design) {
  const url = new URL(href);
  url.search = '';
  url.searchParams.set('vehicle', design.vehicle);
  PARTS.forEach(({ id }) =>
    url.searchParams.set(
      id,
      design.films[id] ||
        `${design.colors[id].slice(1)}~${design.materials[id]}`,
    ),
  );
  url.hash = 'configurator';
  return url.href;
}

// The second colour of colour-flip films, per part.
export function flipColors(design) {
  return Object.fromEntries(
    PARTS.map(({ id }) => [id, FILM_BY_ID.get(design.films[id])?.flip]).filter(
      ([, flip]) => flip,
    ),
  );
}

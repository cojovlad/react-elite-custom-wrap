// Ordering, filtering and previews for the studio film catalogue.
import { FILMS } from './films.js';
import { MATERIALS, MATERIAL_GROUPS } from './materials.js';

// Orders films like a colour fan deck: whites → greys → blacks, then the hue
// wheel (red → yellow → green → blue → purple → pink), light to dark in each.
export function colourSortKey({ hex }) {
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
export const FILMS_BY_COLOUR_ORDER = FILMS.map((film) => [
  colourSortKey(film),
  film,
])
  .sort(([a], [b]) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2])
  .map(([, film]) => film);

// maker is a maker name or 'all', group a MATERIAL_GROUPS id, query lowercase.
export function filterFilms({ maker, group, query }) {
  const materialGroup = MATERIAL_GROUPS.find(({ id }) => id === group);
  const words = query.split(/\s+/).filter(Boolean);
  return FILMS_BY_COLOUR_ORDER.filter((film) => {
    if (maker !== 'all' && film.maker !== maker) return false;
    if (
      materialGroup?.materials &&
      !materialGroup.materials.includes(film.material)
    )
      return false;
    const text =
      `${film.maker} ${film.range} ${film.name} ${film.code} ${film.finish}`.toLowerCase();
    return words.every((word) => text.includes(word));
  });
}

// CSS preview of the film: sheen for metallics, weave for carbon, split for flips.
export function swatchBackground(film) {
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
export const filmVariants = (film) => FILMS_BY_COLOUR.get(filmColourKey(film));

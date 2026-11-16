// Signature palettes: curated looks per finish, built only from films the
// studio stocks. The section rotates through the directions on its own.
import { FILM_BY_ID, PRESETS } from './design.js';

// body and roof are repeated on hood and mirrors unless given.
const look = ({
  body,
  hood = body,
  roof,
  mirrors = roof,
  wheels,
  accents,
}) => ({
  body,
  hood,
  roof,
  mirrors,
  wheels,
  accents,
});

export const PALETTE_DIRECTIONS = [
  {
    id: 'signature',
    label: 'Signature',
    palettes: [
      {
        id: 'monochrome',
        title: 'The Monochrome',
        description: 'Bone white. Piano black.',
        caption: '01 / GLOSS',
        art: 'bone',
        films: PRESETS.monochrome,
      },
      {
        id: 'stealth',
        title: 'After Hours',
        description: 'Deep black. Subtle presence.',
        caption: '02 / MATTE',
        art: 'black',
        films: PRESETS.stealth,
      },
      {
        id: 'green',
        title: 'British Reserve',
        description: 'Racing green. Champagne accents.',
        caption: '03 / SATIN',
        art: 'green',
        films: PRESETS.green,
      },
    ],
  },
  {
    id: 'gloss',
    label: 'Gloss',
    palettes: [
      {
        id: 'nardo-classic',
        title: 'Nardo Classic',
        description: 'Nardo grey. Piano black details.',
        material: 'high-gloss',
        films: look({
          body: '3m-hg61-high-gloss',
          roof: 'skyfol-piano-black',
          wheels: 'skyfol-piano-black',
          accents: 'skyfol-piano-black',
        }),
      },
      {
        id: 'rosso-corsa',
        title: 'Rosso Corsa',
        description: 'Racing red. Champagne accents.',
        material: 'high-gloss',
        films: look({
          body: '3m-hg13-high-gloss',
          roof: 'skyfol-piano-black',
          wheels: 'skyfol-piano-black',
          accents: 'skyfol-champagne-gold',
        }),
      },
      {
        id: 'park-avenue',
        title: 'Park Avenue',
        description: 'Deep navy. Ivory roof.',
        material: 'gloss',
        films: look({
          body: 'avery-cq7560001-gloss',
          roof: '3m-g79-gloss',
          wheels: 'skyfol-piano-black',
          accents: 'skyfol-champagne-gold',
        }),
      },
    ],
  },
  {
    id: 'matte',
    label: 'Matte',
    palettes: [
      {
        id: 'field-olive',
        title: 'Field Olive',
        description: 'Olive green. Matte gold accents.',
        material: 'matte',
        films: look({
          body: 'orafol-285-m-matt',
          roof: 'avery-la8300001-matte',
          wheels: '3m-m12-matte',
          accents: 'orafol-091-m-matt',
        }),
      },
      {
        id: 'champagne-dust',
        title: 'Champagne Dust',
        description: 'Matte champagne. Copper details.',
        material: 'matte',
        films: look({
          body: 'orafol-996-m-matt',
          roof: '3m-dm12-matte',
          wheels: '3m-dm12-matte',
          accents: 'orafol-092-m-matt',
        }),
      },
      {
        id: 'midnight-indigo',
        title: 'Midnight Indigo',
        description: 'Indigo blue. Silver accents.',
        material: 'matte',
        films: look({
          body: '3m-m27-matte',
          roof: '3m-m12-matte',
          wheels: '3m-m12-matte',
          accents: '3m-m21-matte',
        }),
      },
    ],
  },
  {
    id: 'satin',
    label: 'Satin',
    palettes: [
      {
        id: 'bordeaux-noir',
        title: 'Bordeaux Noir',
        description: 'Deep red. Satin black roof.',
        material: 'satin',
        films: look({
          body: '3m-sp273-satin',
          roof: '3m-s12-satin',
          wheels: '3m-s12-satin',
          accents: 'skyfol-ac-s-bond-gold',
        }),
      },
      {
        id: 'key-west',
        title: 'Key West',
        description: 'Caribbean teal. White roof.',
        material: 'satin',
        films: look({
          body: '3m-s57-satin',
          roof: '3m-s10-satin',
          wheels: '3m-s261-satin',
          accents: '3m-s10-satin',
        }),
      },
      {
        id: 'desert-dune',
        title: 'Desert Dune',
        description: 'Desert sand. Gunmetal roof.',
        material: 'satin',
        films: look({
          body: '3m-s49-satin',
          roof: 'skyfol-ac-s-gunmetal',
          wheels: 'skyfol-ac-s-gunmetal',
          accents: 'skyfol-ac-s-champagne',
        }),
      },
    ],
  },
  {
    id: 'metallic',
    label: 'Metallic',
    palettes: [
      {
        id: 'midnight-sapphire',
        title: 'Midnight Sapphire',
        description: 'Night blue metallic. Silver details.',
        material: 'metallic',
        films: look({
          body: 'orafol-196-g-glossy',
          roof: 'skyfol-piano-black',
          wheels: 'orafol-704-g-glossy',
          accents: 'avery-cb1570001-gloss-metallic',
        }),
      },
      {
        id: 'frozen-berry',
        title: 'Frozen Berry',
        description: 'Satin berry metallic. Black roof.',
        material: 'satin-metallic',
        films: look({
          body: '3m-s238-satin',
          roof: '3m-s12-satin',
          wheels: 'avery-bj1030003-satin-metallic',
          accents: '3m-s120-satin',
        }),
      },
      {
        id: 'diamond-frost',
        title: 'Diamond Frost',
        description: 'Diamond silver. Red sparkle accents.',
        material: 'diamond',
        films: look({
          body: 'avery-bi9310001-diamond',
          roof: 'skyfol-piano-black',
          wheels: 'avery-lb5300001-matte-metallic',
          accents: 'avery-bd3040001-diamond',
        }),
      },
    ],
  },
  {
    id: 'pearl',
    label: 'Pearl & flip',
    palettes: [
      {
        id: 'pearl-couture',
        title: 'Pearl Couture',
        description: 'Pearl white. Piano black roof.',
        material: 'pearl',
        films: look({
          body: 'avery-cb1610002-pearl',
          roof: 'skyfol-piano-black',
          wheels: 'skyfol-piano-black',
          accents: 'skyfol-champagne-gold',
        }),
      },
      {
        id: 'northern-lights',
        title: 'Northern Lights',
        description: 'Green to purple flip. Piano black.',
        material: 'flip',
        films: look({
          body: 'avery-bj1080001-colorflow',
          roof: 'skyfol-piano-black',
          wheels: 'skyfol-piano-black',
          accents: 'skyfol-piano-black',
        }),
      },
      {
        id: 'golden-aurora',
        title: 'Golden Aurora',
        description: 'Satin gold flip. Black details.',
        material: 'satin-flip',
        films: look({
          body: '3m-sp264-satin',
          roof: '3m-s12-satin',
          wheels: '3m-s12-satin',
          accents: '3m-s12-satin',
        }),
      },
    ],
  },
  {
    id: 'special',
    label: 'Metal & carbon',
    palettes: [
      {
        id: 'mercury',
        title: 'Mercury',
        description: 'Liquid silver. Carbon accents.',
        material: 'liquid-metal',
        films: look({
          body: 'skyfol-liquid-silver',
          roof: 'skyfol-piano-black',
          wheels: 'skyfol-piano-black',
          accents: 'skyfol-carbon',
        }),
      },
      {
        id: 'track-day',
        title: 'Track Day',
        description: 'Gloss white. Carbon hood and roof.',
        material: 'carbon',
        hero: 'roof',
        films: look({
          body: '3m-hg10-high-gloss',
          hood: '3m-cfs12-texture',
          roof: '3m-cfs12-texture',
          wheels: 'skyfol-piano-black',
          accents: '3m-hg13-high-gloss',
        }),
      },
      {
        id: 'titanium-atelier',
        title: 'Titanium Atelier',
        description: 'Brushed titanium. Bronze accents.',
        material: 'brushed',
        films: look({
          body: 'avery-ar1230001-textured',
          roof: 'skyfol-piano-black',
          wheels: 'skyfol-piano-black',
          accents: 'avery-ar1350001-textured',
        }),
      },
    ],
  },
  {
    id: 'ppf',
    label: 'Coloured PPF',
    palettes: [
      {
        id: 'miami',
        title: 'Miami',
        description: 'Miami blue PPF. Gloss black details.',
        material: 'gloss',
        ppf: true,
        films: look({
          body: 'skyfol-miami-blue',
          roof: 'skyfol-gloss-black',
          wheels: 'skyfol-gloss-black',
          accents: 'skyfol-gloss-black',
        }),
      },
      {
        id: 'isle-of-man',
        title: 'Isle of Man',
        description: 'Isle of Man green. Champagne accents.',
        material: 'gloss',
        ppf: true,
        films: look({
          body: 'carlass-cls-tpu5304b',
          roof: 'skyfol-piano-black',
          wheels: 'skyfol-piano-black',
          accents: 'skyfol-champagne-gold',
        }),
      },
      {
        id: 'stealth-shield',
        title: 'Stealth Shield',
        description: 'Matte black PPF. Gunmetal wheels.',
        material: 'matte',
        ppf: true,
        films: look({
          body: 'skyfol-sm-black',
          roof: 'skyfol-sm-black',
          wheels: 'skyfol-sm-gunmetal',
          accents: 'skyfol-piano-black',
        }),
      },
    ],
  },
];

export const PALETTE_BY_ID = new Map(
  PALETTE_DIRECTIONS.flatMap(({ palettes }) =>
    palettes.map((palette) => [palette.id, palette]),
  ),
);

const channels = (hex) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
// Mixes a colour towards white (amount > 0) or black (amount < 0).
function shade(hex, amount) {
  const target = amount > 0 ? 255 : 0;
  return `#${channels(hex)
    .map((value) =>
      Math.round(value + (target - value) * Math.abs(amount))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
}
const luminance = (hex) => {
  const [r, g, b] = channels(hex).map((value) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const SHEEN = {
  sharp: [0.45, 0, -0.55, 0.35, -0.25],
  soft: [0.3, 0, -0.4, 0.2, -0.2],
  flat: [0.18, 0, -0.2, -0.12, -0.32],
  mirror: [0.7, -0.35, -0.6, 0.8, -0.2],
};
const FINISH_SHEEN = {
  satin: 'soft',
  'satin-metallic': 'soft',
  'satin-pearl': 'soft',
  'satin-flip': 'soft',
  brushed: 'soft',
  matte: 'flat',
  'matte-metallic': 'flat',
  textured: 'flat',
  'liquid-metal': 'mirror',
};
const TEXTURE = {
  carbon:
    'repeating-linear-gradient(45deg, #ffffff12 0 2px, transparent 2px 5px), repeating-linear-gradient(-45deg, #00000038 0 2px, transparent 2px 5px)',
  brushed:
    'repeating-linear-gradient(170deg, #ffffff14 0 1px, transparent 1px 3px)',
  sparkle:
    'radial-gradient(circle, #ffffff40 0.6px, transparent 1.2px) 0 0 / 6px 6px',
};

// Background, folded film and colour dots for one palette card. Signature
// cards keep their hand-tuned CSS art.
export function paletteArt(palette) {
  const films = ['body', 'roof', 'accents'].map((part) =>
    FILM_BY_ID.get(palette.films[part]),
  );
  const dots = [...new Set(films.map((film) => film.hex))];
  if (palette.art) return { className: `palette-${palette.art}`, dots };
  const film = FILM_BY_ID.get(palette.films[palette.hero ?? 'body']);
  const base = film.hex;
  const second = film.flip ?? base;
  const dark = luminance(base) < 0.35;
  const background = dark
    ? `radial-gradient(ellipse at 70% 10%, ${shade(base, 0.28)}, ${shade(base, -0.45)} 60%, ${shade(base, -0.72)})`
    : `linear-gradient(145deg, ${shade(base, -0.08)}, ${shade(base, 0.22)} 44%, ${shade(base, -0.24)})`;
  const [a, b, c, d, e] = SHEEN[FINISH_SHEEN[film.material] ?? 'sharp'];
  const fold = `linear-gradient(170deg, ${shade(base, a)}, ${shade(base, b)} 35%, ${shade(second, c)} 48%, ${shade(second, d)} 50%, ${shade(second, e)} 90%)`;
  const texture =
    TEXTURE[film.material] ??
    (/metallic|diamond|pearl|flip/.test(film.material) ? TEXTURE.sparkle : '');
  return {
    background,
    fold: texture ? `${texture}, ${fold}` : fold,
    dark,
    dots,
  };
}

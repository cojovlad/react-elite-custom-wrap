// Builds src/films.js from the Elite Custom Wrap master colour database (CSV).
// Usage: node scripts/generate-films.mjs [path-to-csv]
// Manufacturer RGB values are used when published; otherwise the swatch colour
// is estimated from the official colour name (flagged with `estimated: true`).
import { readFileSync, writeFileSync } from 'node:fs';
import { parseCsv } from './csv.mjs';

const source = process.argv[2] ?? 'Elite_Custom_Wrap_Master_Color_Database.csv';
const text = readFileSync(source, 'utf8').replace(/^\uFEFF/, '');

// Longest keyword wins. Values approximate the real film swatches.
const NAMED = {
  'nardo grey': '#6c6f70',
  'nardo gray': '#6c6f70',
  'miami blue': '#00a3d9',
  'porsche acidic green': '#9fd42c',
  'porsche signal green': '#21a35a',
  'porsche signal yellow': '#f2c200',
  'porsche gray mysterious green': '#5d6a5f',
  'bmw isle of man green': '#0d4d3c',
  'byd shiny green': '#2f8a63',
  'nio cloud yellow': '#e9d58b',
  'ferrari red': '#c4161c',
  'farrera red': '#c4161c',
  'mclaren oran': '#f26a1b',
  'mustang red': '#b11b22',
  'soul red': '#9e0f1e',
  'piemont red': '#8a1420',
  'tesla satin ceramic white': '#e6e5e0',
  'goodwood green': '#1f3d33',
  'daytona beach blue': '#1f6fb8',
  'marina bay blue': '#1d5fa8',
  'park avenue blue': '#1f3159',
  'santorini blue': '#2c64a6',
  'tiffany blue': '#81d8d0',
  tiffany: '#81d8d0',
  'key west': '#3fb6b4',
  'chanel yellow': '#efd36b',
  'frozen vanilla': '#ece4cf',
  'frozen white silver': '#d6d8d8',
  'frozen leaden gray': '#5f6366',
  'frozen ocean': '#2e8fb5',
  'frozen black': '#1a1b1c',
  'frozen berry': '#6b2340',
  'frozen blood': '#6e0f17',
  'frozen mist': '#a9b0b3',
  'frozen sea': '#2d6f86',
  'frozen wave': '#4a8aa6',
  'black rose': '#3a1a22',
  'bond gold': '#a88b4a',
  'aventurin green': '#1f5a45',
  'selenite grey': '#7c7e7d',
  'maya blue': '#4fa3df',
  'racing orange': '#e2571e',
  'cobalt blue': '#1f4aa8',
  'cobalt depth': '#1b3570',
  'pearl white': '#eeeae0',
  'white pearl': '#eeeae0',
  'crystal white': '#f1f1ee',
  'snow white': '#f4f4f2',
  'white snow': '#f4f4f2',
  'snowy mountain white': '#eef0f0',
  'marine white': '#eceeea',
  'diamond white': '#f0efeb',
  'white gold sparkle': '#e6dcc0',
  'white aluminum': '#d9dbda',
  'light ivory': '#efe7d2',
  'piano black': '#0b0c0d',
  'deep black': '#0e0f10',
  'dead matte black': '#141515',
  'obsidian black': '#121315',
  'shadow black': '#16171a',
  'laser black': '#141518',
  'matrix black': '#151617',
  'ember black': '#1a1414',
  'azurite black': '#121a26',
  'gold dust black': '#1d1a14',
  'black flash purple': '#1e1424',
  'black rock grey': '#2e3032',
  'blackstone charcoal': '#2a2b2d',
  'black metallic': '#1a1b1d',
  'battleship gray': '#6b7073',
  'elephant grey': '#7d7c78',
  'chinchilla grey': '#9a9a97',
  'chalk grey': '#b7b6b1',
  'dove grey': '#9fa09d',
  'misty grey': '#a5a9ab',
  'spy grey': '#4f5254',
  'rock grey': '#5c5f61',
  'storm gray': '#585d61',
  'volcano gray': '#4a4b4c',
  'meteor gray': '#5a5d60',
  'gray blue': '#5d6f80',
  'gray aluminum': '#9c9fa0',
  'smoky concrete': '#8b8a85',
  'fog over rocks': '#8e9294',
  'dark basalt': '#3a3c3d',
  'dark grey': '#45484a',
  'dark gray': '#45484a',
  'light grey': '#b4b7b8',
  'graphite shine': '#45484c',
  graphite: '#474a4d',
  anthracite: '#383b3e',
  charcoal: '#36383a',
  gunmetal: '#4b5054',
  thundercloud: '#5b6066',
  'steel cold': '#8d969b',
  'silver haze': '#b9bcbe',
  'sterling silver': '#bfc1c2',
  'quick silver': '#c3c6c8',
  'diamond silver': '#c8cacb',
  'space silver': '#a8abad',
  'liquid silver': '#cfd2d3',
  'liquid white silver': '#dcdedd',
  'liquid leaden gray': '#6a6e72',
  'liquid copper': '#b06a45',
  'liquid bronze': '#8f6a3e',
  'antique bronze': '#7a5c3a',
  'brushed aluminium': '#b9bcbd',
  'brushed aluminum': '#b9bcbd',
  'brushed steel': '#8e9396',
  'brushed titanium': '#77797a',
  'brushed bronze': '#8a6a45',
  'brushed black': '#2a2b2c',
  'champagne gold': '#c9b183',
  champagne: '#c6b28c',
  'rose quartz': '#d9a8b0',
  'ash rose': '#b88d8f',
  'cosmic rose': '#b56b7f',
  'velvet rose': '#9a5a68',
  'luscious lips': '#b0213f',
  'peach pink': '#f2b5a0',
  'pale peach': '#f3cdb6',
  'tutu pink': '#f2b8c6',
  'pool party pink': '#ef7fb0',
  'bubblegum pink': '#f28cb8',
  'flamingo dance': '#f07f8f',
  'fierce fuchsia': '#c2246f',
  magenta: '#b5246d',
  'powder mist': '#cfc9cf',
  'lavender ice': '#bdb3d6',
  'lilac storm': '#8f7fa8',
  'shadow orchid': '#5e3f66',
  'plum explosion': '#5b2149',
  'beetroot purple': '#5a1d3c',
  'grape purple': '#55306e',
  'gt purple': '#4d2a7a',
  'fun purple': '#6a3a9a',
  'vibrant violet': '#7340a8',
  'ultramarine violet': '#3e2f8f',
  ultraviolet: '#5a2f9e',
  'amethyst night': '#3a2450',
  amethyst: '#7a4f9a',
  'mysterious indigo': '#2c2a5e',
  'indigo night': '#202447',
  'indigo blue': '#24306e',
  indigo: '#2d3478',
  'midnight blue': '#18233f',
  'night blue': '#1b2540',
  'navy blue': '#1b2a4a',
  'lunar blue': '#243a5e',
  'cosmic blue': '#1e3f86',
  'intergalactic blue': '#24308a',
  'electric sapphire': '#1846b8',
  'deep blue': '#1a2f6a',
  'dark blue': '#1d2d55',
  'intense blue': '#1f45a8',
  'nitro blue': '#1f5ec2',
  'hyper blue': '#1c63d1',
  'bright blue': '#1d6fd6',
  'perfect blue': '#2357b8',
  'dreamline blue': '#2a6bb8',
  'blue fire': '#2058c9',
  'brill-blue': '#1e5bc6',
  'boat blue': '#1e4f9a',
  'slate blue': '#4d6278',
  'glacier blue': '#a8c8d8',
  'frosty blue': '#b4cfdc',
  'ice-snow blue': '#c8dde6',
  'arctic ice': '#d2e2e8',
  'baby blue': '#a9cbe6',
  'light blue': '#7fb2e0',
  'sky blue': '#6cb3e3',
  'azure breeze': '#5fa7d6',
  'sea-breeze blue': '#4fa9c9',
  'aqua blue': '#2fb0c6',
  aquamarine: '#5ec7c0',
  'turquoise ocean': '#1c9aa6',
  'turquoise lavender': '#6fa9c0',
  'martin turquoise': '#1f8f9a',
  'atomic teal': '#0f8a8c',
  'cool teal': '#2d8c8e',
  'ocean shimmer': '#2a6f8a',
  'blue raspberry': '#2a7ad1',
  'danshilan blue': '#3a6fa0',
  'kaqi blue ashes': '#6c7f8c',
  'green blue': '#1f7a7a',
  'moonstone silver': '#9fb2c0',
  atlantis: '#2f8f8a',
  'mint storm': '#8fc4b0',
  'smooth sage': '#9aa88f',
  'light pistachio': '#bcd39a',
  'light green': '#7fc46a',
  'apple green': '#7fbf3a',
  'lime green': '#8cc63f',
  'lime splash': '#a4cf3a',
  'lemon neon': '#d9f02a',
  'toxic green': '#6fd12a',
  'cyber green': '#3fd16a',
  'electric green': '#3ec44a',
  'lively green': '#3caa4a',
  'grass green': '#3e9a3a',
  'kelly green': '#2e9a46',
  'mantis green': '#6fb04a',
  'verde mantis': '#6fb04a',
  'green envy': '#2f7a46',
  'tropical vacation green': '#1fa38a',
  'emerald green': '#14704a',
  'emerald shadow': '#123f30',
  'midnight emerald': '#0f3328',
  emerald: '#16744e',
  jade: '#1f7a62',
  'francesca green': '#2a6a4a',
  'jungle green': '#2a5a3a',
  'komodo green': '#4a5a3a',
  'laurel green': '#5a6e4a',
  'pine green': '#1f4a38',
  'pine in fog': '#4f6a5e',
  'forest moss': '#4a5a32',
  'moss green': '#5a6a3a',
  'olive green': '#5f6338',
  'military green': '#4b5338',
  'combat green': '#4a5038',
  'marsh green': '#4f5a42',
  'khaki green': '#6b6a4a',
  'murky forest': '#2e3a2e',
  'towering green': '#2a5a44',
  'urban green': '#4a6a58',
  'dark green': '#1e3d2e',
  'cadmium green': '#1f6a4a',
  'golden green': '#8a8a3a',
  'rainbow emerald': '#1a7a5a',
  'neon yellow': '#e6f22a',
  radioactive: '#c8e62a',
  'citric acid': '#d8e83a',
  'crystal lemon yellow': '#f2e04a',
  'phantom lemon yellow': '#f0dc3a',
  'lucid yellow': '#f5d82a',
  'bright yellow': '#f6d21a',
  'ambulance yellow': '#f2d21a',
  'bumblebee yellow': '#f2c81a',
  'sunflower yellow': '#f2b81a',
  sunflower: '#f2b81a',
  'golden yellow': '#e8a81a',
  'energetic yellow': '#f2c21a',
  'dark yellow': '#e2a81a',
  'maple yellow': '#d99a2a',
  'bitter yellow': '#d6c23a',
  'desert yellow': '#c9a65a',
  'honey light': '#d9a24a',
  'sun caramel': '#b9773a',
  'cognac amber': '#9a5a2a',
  'amber spark': '#c2752a',
  'diamond amber': '#c2752a',
  mandarin: '#f07a1a',
  'tangerine dream': '#f2851f',
  'fiery orange': '#ea5a1a',
  'lava orange': '#e2501a',
  'stunning orange': '#f06a1a',
  'bright orange': '#f2701a',
  'burnt orange': '#c2501a',
  'deep orange': '#d2481a',
  'golden orange': '#e8861a',
  'sunset ride': '#e0603a',
  'fire agate': '#b8401f',
  'carmine sunset': '#c23a2a',
  'scarlet heat': '#c8201f',
  'flame red': '#d0201a',
  'dragon fire red': '#c4161c',
  'hot rod red': '#c0161c',
  'rally red': '#c0141c',
  'passion red': '#b8141f',
  'pure red': '#cc1a1a',
  'strawberry red': '#c41f2f',
  'cardinal red': '#a8141f',
  'carmine red': '#9e1424',
  'sunset red': '#c0302a',
  'smoldering red': '#7a1a1a',
  'ruby red': '#8e0f24',
  'ruby rosso': '#8e0f24',
  'garnet red': '#6e1420',
  'garnet shine': '#7a1a2a',
  'vampire red': '#5e0a14',
  'diablo ross': '#8a0f1a',
  'cherry ice': '#a01a34',
  cherry: '#8a1020',
  'soft red': '#c43a3a',
  'charm red': '#6a141a',
  burgundy: '#5a1626',
  'walnut wood': '#5a3a24',
  'coffee shadow': '#3e2c22',
  'chocolate velvet': '#3a241c',
  'hans brown': '#5a3a2a',
  'light brown': '#8a6a4a',
  'desert sand': '#c2a77e',
  'desert calm': '#b8a283',
  sandstone: '#b39e7c',
  desert: '#bda27a',
  'velvet haze': '#7a6a74',
  eclipse: '#2a2438',
  'magnetic burst': '#3a3f8a',
  'fresh spring gold': '#c8b46a',
  'solar dawn': '#3a1414',
  'ghost pearl': '#e8e6ea',
  'electric coral': '#ef6f5f',
  'golden aurora': '#c9a24a',
  'volcanic flare': '#b8401f',
  'deep space': '#1e2442',
  'hidden forest': '#3a4440',
  'rising sun': '#c0302a',
  'roaring thunder': '#2a3f8a',
  'rushing riptide': '#1f9ab0',
  'urban jungle': '#a8acae',
  'lightning ridge': '#2f7a46',
  damascus: '#3a3b3d',
  'pride prismatic': '#8a8c8e',
  'lacquer metal jade': '#1f6a5a',
  psychedelic: '#3a2a5a',
  'blue carbon': '#1d3a7a',
  'berniner ash': '#8f918f',
  white: '#eeeeec',
  black: '#141516',
  silver: '#b8bbbd',
  grey: '#7a7d80',
  gray: '#7a7d80',
  blue: '#2a56b0',
  red: '#b81c22',
  green: '#2f7a46',
  yellow: '#f0c81a',
  orange: '#ec6a1a',
  gold: '#b8984a',
  brown: '#6a4630',
  purple: '#5e2f86',
  violet: '#6a3a9a',
  pink: '#e98fb0',
  carbon: '#1d1e20',
  aluminium: '#b9bcbd',
};
const NAMED_KEYS = Object.keys(NAMED).sort((a, b) => b.length - a.length);
const GROUP_HUES = {
  red: '#b81c22',
  green: '#2f7a46',
  blue: '#2a56b0',
  yellow: '#f0c81a',
  purple: '#5e2f86',
  'powder pink': '#e7b3c2',
  grey: '#7a7d80',
  brown: '#6a4630',
};

function lookup(value) {
  for (const key of NAMED_KEYS) if (value.includes(key)) return NAMED[key];
  return null;
}

function estimateHex(name, range) {
  const lower = name.toLowerCase().replace(/\s+-\s+o$/, '');
  const group = range.toLowerCase().split('/ ')[1];
  return (
    lookup(lower.split('/')[0]) ??
    lookup(lower) ??
    GROUP_HUES[group] ??
    '#8a8c8e'
  );
}

function secondaryHex(name) {
  const parts = name.split('/');
  return parts.length < 2 ? null : lookup(parts[1].toLowerCase().trim());
}

// Material model used by the renderer.
function classifyFinish(rawFinish, name) {
  const value = `${rawFinish} ${name}`.toLowerCase();
  const nameLower = name.toLowerCase();
  const finish = rawFinish.toLowerCase();
  if (/carbon/.test(value)) return 'carbon';
  if (/brushed/.test(value)) return 'brushed';
  if (
    /flip|colorflow|psychedelic|rainbow|prismatic/.test(value) ||
    /\w\/\w/.test(name)
  )
    return /satin|matt/.test(value) ? 'satin-flip' : 'flip';
  if (/diamond|sparkle|shimmer|laser|dust/.test(value)) return 'diamond';
  if (/rugged|textur|honeycomb|cocoon|damascus/.test(value)) return 'textured';
  if (/liquid|chrome/.test(value)) return 'liquid-metal';
  const metallic = /metallic|frozen|shine|burst|aluminum|aluminium/.test(value);
  const pearl = /pearl/.test(value);
  const matte =
    /matt/.test(finish) || /^sm |\bmatte?\b|dead matte/.test(nameLower);
  const satin = /satin/.test(finish) || /^s |^ac s |\bsatin\b/.test(nameLower);
  if (pearl) return matte || satin ? 'satin-pearl' : 'pearl';
  if (matte) return metallic ? 'matte-metallic' : 'matte';
  if (satin) return metallic ? 'satin-metallic' : 'satin';
  if (metallic) return 'metallic';
  if (/high gloss/.test(finish) || /piano/.test(nameLower)) return 'high-gloss';
  return 'gloss';
}

const rows = parseCsv(text);
const header = rows.shift().map((value) => value.trim());
const column = (label) => header.indexOf(label);
const columns = {
  maker: column('Produc\u0103tor'),
  range: column('Gam\u0103'),
  name: column('Denumire oficial\u0103'),
  code: column('Cod produs'),
  finish: column('Finisaj'),
  hex: column('HEX (doar conversie RGB)'),
};
if (Object.values(columns).some((index) => index < 0))
  throw new Error(`Unexpected CSV header: ${header.join(', ')}`);
const usedIds = new Set();
const slug = (value) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const films = rows.map((row) => {
  const maker = row[columns.maker].trim();
  const range = row[columns.range].trim();
  const name = row[columns.name].trim();
  const code = row[columns.code].trim();
  const rawFinish = row[columns.finish].trim();
  const finish = /as listed|not specified/i.test(rawFinish) ? '' : rawFinish;
  const officialHex = row[columns.hex].trim();
  const material = classifyFinish(finish, name);
  const base = slug(`${maker.split(/[\s/]/)[0]}-${code || name}-${finish}`);
  let id = base;
  for (let index = 2; usedIds.has(id); index++) id = `${base}-${index}`;
  usedIds.add(id);
  const film = {
    id,
    maker,
    range,
    name,
    code,
    finish,
    material,
    hex: /^#[0-9a-f]{6}$/i.test(officialHex)
      ? officialHex.toLowerCase()
      : estimateHex(name, range),
  };
  if (!/^#[0-9a-f]{6}$/i.test(officialHex)) film.estimated = true;
  if (/ppf/i.test(range)) film.ppf = true;
  if (material === 'flip' || material === 'satin-flip') {
    const flip = secondaryHex(name);
    if (flip) film.flip = flip;
  }
  return film;
});

const output = `// Generated by scripts/generate-films.mjs from the Elite Custom Wrap master colour
// database. Do not edit by hand; update the CSV and re-run the script.
// \`estimated\`: the manufacturer did not publish RGB, so the swatch is approximated
// from the official colour name. Always confirm with a physical sample.
export const FILMS = ${JSON.stringify(films, null, 2)};

export const FILM_MAKERS = [...new Set(FILMS.map((film) => film.maker))];
`;
writeFileSync('src/films.js', output);
const counts = {};
films.forEach(
  (film) => (counts[film.material] = (counts[film.material] ?? 0) + 1),
);
console.log(
  `${films.length} films, ${films.filter((film) => film.estimated).length} estimated`,
  counts,
);

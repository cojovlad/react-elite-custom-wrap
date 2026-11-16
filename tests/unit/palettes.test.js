import { beforeAll, describe, expect, it } from 'vitest';
import { FILM_BY_ID } from '../../src/design.js';
import { loadTranslations } from '../../src/i18n.js';
import { MATERIALS } from '../../src/materials.js';
import { PARTS } from '../../src/parts.js';
import {
  PALETTE_BY_ID,
  PALETTE_DIRECTIONS,
  paletteArt,
} from '../../src/palettes.js';
import ro from '../../src/locales/ro.json';

const palettes = PALETTE_DIRECTIONS.flatMap(({ palettes }) => palettes);

beforeAll(loadTranslations);

describe('signature palettes', () => {
  it('shows three palettes per finish, each with a unique id', () => {
    for (const direction of PALETTE_DIRECTIONS)
      expect(direction.palettes, direction.id).toHaveLength(3);
    expect(PALETTE_BY_ID.size).toBe(palettes.length);
  });

  it('uses only films the studio stocks, on every part', () => {
    for (const palette of palettes)
      for (const { id } of PARTS)
        expect(FILM_BY_ID.has(palette.films[id]), `${palette.id} ${id}`).toBe(
          true,
        );
  });

  it('has a known finish, translations and real PPF films', () => {
    for (const direction of PALETTE_DIRECTIONS)
      expect(Object.hasOwn(ro, direction.label), direction.label).toBe(true);
    for (const palette of palettes) {
      expect(Object.hasOwn(ro, palette.description), palette.id).toBe(true);
      if (palette.caption) continue;
      expect(MATERIALS[palette.material], palette.id).toBeDefined();
      if (palette.ppf)
        expect(FILM_BY_ID.get(palette.films.body).ppf, palette.id).toBe(true);
    }
  });

  it('keeps the hand-tuned art of the original palettes', () => {
    expect(paletteArt(PALETTE_BY_ID.get('monochrome'))).toMatchObject({
      className: 'palette-bone',
    });
    const art = paletteArt(PALETTE_BY_ID.get('track-day'));
    expect(art.background).toMatch(/gradient/);
    expect(art.fold).toMatch(/repeating-linear-gradient/);
    expect(art.dark).toBe(true);
    expect(art.dots.every((hex) => /^#[0-9a-f]{6}$/i.test(hex))).toBe(true);
  });
});

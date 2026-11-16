import { describe, expect, it } from 'vitest';
import { PARTS } from '../../src/parts.js';
import { MATERIALS } from '../../src/materials.js';
import { FILMS } from '../../src/films.js';
import {
  defaultDesign,
  designFromFilms,
  designFromParams,
  designUrl,
  FILM_BY_ID,
  flipColors,
  PLAY_COLORS,
  PLAY_MATERIALS,
  PRESETS,
  validateDesign,
  validHex,
} from '../../src/design.js';

const params = (href) => new URL(href).searchParams;

describe('design model', () => {
  it('starts from a valid signature design', () => {
    const design = defaultDesign();
    expect(design.vehicle).toBe('bmw');
    expect(validateDesign(design)).toEqual(design);
    for (const { id } of PARTS)
      expect(FILM_BY_ID.has(design.films[id])).toBe(true);
  });

  it('only references existing films, colours and finishes', () => {
    for (const preset of Object.values(PRESETS))
      expect(() => designFromFilms(preset)).not.toThrow();
    for (const { hex } of PLAY_COLORS) expect(validHex(hex)).toBe(true);
    for (const material of PLAY_MATERIALS)
      expect(MATERIALS[material]).toBeDefined();
  });

  it('round-trips film designs through a shared link', () => {
    const design = { vehicle: 'audi-rs7', ...designFromFilms(PRESETS.green) };
    const href = designUrl('https://example.ro/?lang=ro#top', design);
    expect(href).toMatch(/^https:\/\/example\.ro\/\?vehicle=audi-rs7&/);
    expect(href.endsWith('#configurator')).toBe(true);
    expect(href).not.toContain('lang=');
    expect(designFromParams(params(href))).toEqual(design);
  });

  it('round-trips custom colours with their finish', () => {
    const design = defaultDesign();
    design.films.body = '';
    design.colors.body = '#af222b';
    design.materials.body = 'matte';
    const href = designUrl('http://localhost/', design);
    expect(href).toContain('body=af222b%7Ematte');
    expect(designFromParams(params(href))).toEqual(design);
  });

  it('rejects broken or unknown links', () => {
    const href = designUrl('http://localhost/', defaultDesign());
    const unknownVehicle = params(href);
    unknownVehicle.set('vehicle', 'not-a-car');
    expect(designFromParams(unknownVehicle)).toBeNull();
    const badColour = params(href);
    badColour.set('body', 'zzzzzz~gloss');
    expect(designFromParams(badColour)).toBeNull();
    const badFinish = params(href);
    badFinish.set('body', 'af222b~plastic');
    expect(designFromParams(badFinish)).toBeNull();
  });

  it('accepts the earlier saved format with one shared finish', () => {
    const colors = Object.fromEntries(PARTS.map(({ id }) => [id, '#ABCDEF']));
    const design = validateDesign({ vehicle: 'bmw', colors, finish: 'satin' });
    expect(design.colors.body).toBe('#abcdef');
    expect(design.materials.roof).toBe('satin');
    expect(design.films.body).toBe('');
  });

  it('reports the second colour of colour-flip films only', () => {
    const flip = FILMS.find((film) => film.flip);
    const design = defaultDesign();
    expect(flipColors(design)).toEqual({});
    design.films.hood = flip.id;
    expect(flipColors(design)).toEqual({ hood: flip.flip });
  });
});

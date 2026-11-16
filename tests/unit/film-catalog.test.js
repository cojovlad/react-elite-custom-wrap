import { describe, expect, it } from 'vitest';
import { FILMS } from '../../src/films.js';
import {
  colourSortKey,
  filmVariants,
  filterFilms,
  FILMS_BY_COLOUR_ORDER,
  swatchBackground,
} from '../../src/film-catalog.js';

const all = { maker: 'all', group: 'all', query: '' };

describe('film catalogue', () => {
  it('lists every film exactly once', () => {
    expect(FILMS_BY_COLOUR_ORDER).toHaveLength(FILMS.length);
    expect(new Set(FILMS_BY_COLOUR_ORDER).size).toBe(FILMS.length);
  });

  it('orders neutrals first, then the hue wheel, light to dark', () => {
    const keys = FILMS_BY_COLOUR_ORDER.map(colourSortKey);
    for (let i = 1; i < keys.length; i += 1) {
      const [a, b] = [keys[i - 1], keys[i]];
      const order = a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
      expect(order).toBeLessThanOrEqual(0);
    }
    expect(colourSortKey({ hex: '#ffffff' })[0]).toBe(0);
    expect(colourSortKey({ hex: '#ff0000' })).toEqual([1, 0, -0.5]);
  });

  it('filters by maker, finish group and every search word', () => {
    expect(filterFilms(all)).toEqual(FILMS_BY_COLOUR_ORDER);
    const maker = FILMS[0].maker;
    expect(
      filterFilms({ ...all, maker }).every((film) => film.maker === maker),
    ).toBe(true);
    const matte = filterFilms({ ...all, group: 'matte' });
    expect(matte.length).toBeGreaterThan(0);
    expect(
      matte.every((film) =>
        ['matte', 'matte-metallic'].includes(film.material),
      ),
    ).toBe(true);
    const found = filterFilms({ ...all, query: '3m g79' });
    expect(found.map(({ id }) => id)).toContain('3m-g79-gloss');
    expect(filterFilms({ ...all, query: 'no-such-film-xyz' })).toEqual([]);
  });

  it('offers only the finishes stocked for the same colour', () => {
    for (const film of FILMS) {
      const variants = filmVariants(film);
      expect(variants.some(({ material }) => material === film.material)).toBe(
        true,
      );
      expect(new Set(variants.map(({ material }) => material)).size).toBe(
        variants.length,
      );
      expect(variants.every(({ maker }) => maker === film.maker)).toBe(true);
    }
  });

  it('previews every film with its own colour', () => {
    for (const film of FILMS)
      expect(swatchBackground(film)).toContain(film.hex);
  });
});

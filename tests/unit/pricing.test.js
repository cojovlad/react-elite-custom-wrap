import { describe, expect, it } from 'vitest';
import { FILMS } from '../../src/films.js';
import { VEHICLES } from '../../src/vehicles.js';
import { PRICE_LINES } from '../../src/price-list.js';
import {
  filmLine,
  formatRange,
  PRICE_CATEGORIES,
  requestEstimate,
  SIZE_IDS,
  SIZES,
  vehicleSize,
  wrapEstimate,
} from '../../src/pricing.js';
import ro from '../../src/locales/ro.json';
import html from '../../index.html?raw';

const film = (id) => FILMS.find((item) => item.id === id);
const VEHICLE = (id) => VEHICLES.find((item) => item.id === id);

describe('price list', () => {
  it('has every size for every line, from the CSV', () => {
    expect(PRICE_LINES).toHaveLength(11);
    for (const line of PRICE_LINES)
      expect(Object.keys(line.prices).sort()).toEqual([...SIZE_IDS].sort());
    const categories = new Set(PRICE_LINES.map((line) => line.category));
    expect([...categories]).toEqual(PRICE_CATEGORIES.map(({ id }) => id));
  });

  it('gives every configurator vehicle a size', () => {
    for (const vehicle of VEHICLES)
      expect(SIZE_IDS, vehicle.id).toContain(vehicleSize(vehicle));
    expect(vehicleSize(VEHICLE('vw-golf'))).toBe('compact');
    expect(vehicleSize(VEHICLE('bmw'))).toBe('sedan');
    expect(vehicleSize(VEHICLE('porsche-macan'))).toBe('suv');
    expect(vehicleSize(VEHICLE('bmw-x5-m'))).toBe('luxury');
  });

  it('maps every studio film to an existing price line', () => {
    for (const item of FILMS) {
      const [category, id] = filmLine(item);
      expect(
        PRICE_LINES.some(
          (line) => line.category === category && line.id === id,
        ),
        item.id,
      ).toBe(true);
    }
    expect(filmLine(film('3m-g79-gloss'))).toEqual(['wrap', '3m-2080']);
    const carbon = FILMS.find(
      (item) => item.maker === '3M' && item.material === 'carbon',
    );
    expect(filmLine(carbon)).toEqual(['wrap', '3m-special-color-flip']);
  });

  it('has translations for sizes and categories', () => {
    for (const { label } of SIZES)
      expect(Object.hasOwn(ro, label) || label === 'SUV', label).toBe(true);
    for (const { title, description } of PRICE_CATEGORIES) {
      expect(Object.hasOwn(ro, title), title).toBe(true);
      expect(Object.hasOwn(ro, description), description).toBe(true);
    }
  });
});

describe('estimates', () => {
  it('prices a studio film exactly and a free colour as a range', () => {
    expect(wrapEstimate('sedan', film('3m-g79-gloss'))).toMatchObject({
      min: 10990,
      max: 10990,
    });
    expect(wrapEstimate('compact', null, 'gloss')).toMatchObject({
      min: 8990,
      max: 9990,
    });
    expect(wrapEstimate('compact', null, 'carbon')).toMatchObject({
      min: 11490,
      max: 11490,
    });
  });

  it('adds services without counting protection twice', () => {
    const wrapAndFront = requestEstimate({
      size: 'suv',
      services: ['Color change wrap', 'Front PPF', 'Chrome delete'],
      film: film('3m-g79-gloss'),
    });
    expect(wrapAndFront).toMatchObject({
      min: 12990 + 6990,
      max: 12990 + 7490,
      onRequest: ['Chrome delete'],
    });
    const fullAndFront = requestEstimate({
      size: 'suv',
      services: ['Paint protection film', 'Front PPF'],
    });
    expect(fullAndFront.items.map((item) => item.service)).toEqual([
      'Paint protection film',
    ]);
    const colourPpf = requestEstimate({
      size: 'compact',
      services: ['Color change wrap', 'Paint protection film', 'Front PPF'],
      film: film('skyfol-piano-black'),
    });
    expect(colourPpf).toMatchObject({ min: 20490, max: 20490 });
    expect(colourPpf.rows).toMatchObject([
      { service: 'Color change wrap', label: 'Coloured PPF', min: 20490 },
      { service: 'Paint protection film', includedIn: 'Coloured PPF' },
      { service: 'Front PPF', includedIn: 'Coloured PPF' },
    ]);
    expect(requestEstimate({ size: 'suv', services: [] })).toBeNull();
    expect(
      requestEstimate({ size: 'suv', services: ['Bespoke details'] }),
    ).toEqual({
      onRequest: ['Bespoke details'],
      rows: [{ service: 'Bespoke details', onRequest: true }],
    });
  });

  it('lists every chosen service and keeps quoted ones out of the total', () => {
    const estimate = requestEstimate({
      size: 'sedan',
      services: [
        'Paint protection film',
        'Front PPF',
        'Chrome delete',
        'Bespoke details',
      ],
    });
    expect(estimate).toMatchObject({
      min: 13490,
      max: 14490,
      onRequest: ['Chrome delete', 'Bespoke details'],
    });
    expect(estimate.rows).toMatchObject([
      { service: 'Paint protection film', min: 13490, max: 14490 },
      { service: 'Front PPF', includedIn: 'Paint protection film' },
      { service: 'Chrome delete', onRequest: true },
      { service: 'Bespoke details', onRequest: true },
    ]);
  });

  it('formats prices for the language', () => {
    expect(formatRange({ min: 8990, max: 8990 }, 'ro')).toBe('8.990');
    expect(formatRange({ min: 8990, max: 10990 }, 'ro')).toBe('8.990 – 10.990');
  });
});

describe('published prices', () => {
  const prices = (category) =>
    PRICE_LINES.filter((line) => line.category === category).flatMap((line) =>
      Object.values(line.prices),
    );
  const bounds = (...categories) => {
    const all = categories.flatMap(prices);
    return [Math.min(...all), Math.max(...all)];
  };

  it('keeps the structured data in line with the price list', () => {
    const offers = [
      ...html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
      ),
    ]
      .map((match) => JSON.stringify(JSON.parse(match[1])))
      .join('')
      .match(/"minPrice":\d+,"maxPrice":\d+/g);
    expect(offers).toEqual(
      [bounds('wrap'), bounds('ppf', 'ppf-color'), bounds('ppf-front')].map(
        ([min, max]) => `"minPrice":${min},"maxPrice":${max}`,
      ),
    );
  });

  it('keeps the FAQ answer in line with the price list', () => {
    const text = html.replace(/\s+/g, ' ');
    const answer = Object.keys(ro).find((key) =>
      key.startsWith('A full colour change starts at'),
    );
    expect(text).toContain(answer);
    const [wrapMin, wrapMax] = bounds('wrap');
    for (const value of [
      wrapMin,
      wrapMax,
      bounds('ppf')[0],
      bounds('ppf-color')[0],
      bounds('ppf-front')[0],
    ]) {
      expect(answer).toContain(`${value.toLocaleString('en')} lei`);
      expect(ro[answer]).toContain(
        `${value.toLocaleString('ro', { useGrouping: 'always' })} lei`,
      );
    }
  });
});

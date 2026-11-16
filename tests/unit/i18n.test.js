import { beforeAll, describe, expect, it } from 'vitest';
import {
  getLocale,
  languages,
  loadTranslations,
  setLocale,
  t,
} from '../../src/i18n.js';

const locales = Object.keys(languages).filter((code) => code !== 'en');
const tables = import.meta.glob('../../src/locales/*.json', {
  eager: true,
  import: 'default',
});
const table = (code) => tables[`../../src/locales/${code}.json`];
const placeholders = (text) =>
  [...text.matchAll(/\{(\w+)\}/g)].map(([, name]) => name).sort();

beforeAll(loadTranslations);

describe('translations', () => {
  it('has the same messages in every language', () => {
    const keys = Object.keys(table('ro')).sort();
    for (const code of locales)
      expect(Object.keys(table(code)).sort()).toEqual(keys);
  });

  it('defines every message and keeps its placeholders', () => {
    for (const code of locales)
      for (const [key, value] of Object.entries(table(code))) {
        // Some words (e.g. "the") are intentionally empty in other languages.
        expect(typeof value, `${code}: ${key}`).toBe('string');
        expect(placeholders(value), `${code}: ${key}`).toEqual(
          placeholders(key),
        );
      }
  });

  it('fills placeholders and falls back to the English key', () => {
    setLocale('ro', { persist: false });
    expect(getLocale()).toBe('ro');
    expect(t('{count} films', { count: 3 })).toBe('3 folii');
    expect(t('A message without translation')).toBe(
      'A message without translation',
    );
    expect(t('{count} films')).toBe('{count} folii');
    setLocale('xx', { persist: false });
    expect(getLocale()).toBe('en');
    expect(t('{count} films', { count: 1 })).toBe('1 films');
  });
});

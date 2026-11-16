import { beforeAll, describe, expect, it } from 'vitest';
import { loadTranslations, setLocale } from '../../src/i18n.js';
import {
  briefLines,
  isValidEmail,
  isValidPhone,
  requestFields,
  whatsappMessage,
  whatsappUrl,
} from '../../src/request.js';

const request = {
  name: 'Ion Popescu',
  email: 'ion@example.com',
  phone: '',
  vehicle: 'BMW M4 Competition (add model year)',
  ownCar: '',
  services: ['Chrome delete'],
  notes: '',
  honey: '',
  preview: 'BMW M4 Competition',
  link: 'https://example.ro/?vehicle=bmw#configurator',
};
const parts = [['Body', '3M Light Ivory (G79) · Gloss (#EFE7D2)']];

beforeAll(async () => {
  await loadTranslations();
  setLocale('en', { persist: false });
});

describe('consultation request', () => {
  it('opens the studio WhatsApp number with the encoded text', () => {
    expect(whatsappUrl('Salut & bună!')).toBe(
      'https://wa.me/40773239125?text=Salut%20%26%20bun%C4%83!',
    );
  });

  it('lists the car from the site when the customer found it', () => {
    const fields = requestFields(request, parts);
    expect(fields.map(([label]) => label)).toEqual([
      'Name',
      'Email',
      'Phone',
      'Actual vehicle',
      'Services',
      'Preview vehicle',
      'Body',
      'Project notes',
      'Design link',
    ]);
    expect(Object.fromEntries(fields).Phone).toBe('—');
    expect(Object.fromEntries(fields)['Project notes']).toBe(
      'No additional notes.',
    );
  });

  it("puts the customer's own car first when it is not on the site", () => {
    const fields = requestFields(
      { ...request, ownCar: 'Dacia Logan 2019' },
      parts,
    );
    const vehicle = fields.find(([label]) => label === 'Vehicle');
    expect(vehicle[1]).toBe(
      'Dacia Logan 2019 (preview shown on: BMW M4 Competition)',
    );
    expect(fields.some(([label]) => label === 'Preview vehicle')).toBe(false);
  });

  it('formats the WhatsApp message in the active language', () => {
    setLocale('ro', { persist: false });
    const message = whatsappMessage(requestFields(request, parts));
    setLocale('en', { persist: false });
    const lines = message.split('\n');
    expect(lines[0]).toBe(
      'Bună, Elite Custom Wrap! Aș dori o consultanță pentru mașina mea.',
    );
    expect(lines[1]).toBe('');
    expect(lines).toContain('*Nume:* Ion Popescu');
    expect(lines).toContain('*Body:* 3M Light Ivory (G79) · Gloss (#EFE7D2)');
  });

  it('validates email addresses and optional phone numbers', () => {
    expect(isValidEmail('ion@example.com')).toBe(true);
    expect(isValidEmail('ion@example')).toBe(false);
    expect(isValidEmail('ion @example.com')).toBe(false);
    expect(isValidPhone('')).toBe(true);
    expect(isValidPhone('+40 773 239 125')).toBe(true);
    expect(isValidPhone('(021) 555-01')).toBe(true);
    expect(isValidPhone('12345')).toBe(false);
    expect(isValidPhone('call me')).toBe(false);
  });

  it('includes every detail in the downloadable brief', () => {
    const lines = briefLines(
      request,
      ['Body: 3M Light Ivory'],
      new Date(2026, 0, 2),
    );
    expect(lines[0]).toBe('ELITE CUSTOM WRAP / CONSULTATION BRIEF');
    expect(lines).toContain('Body: 3M Light Ivory');
    expect(lines).toContain(request.link);
    expect(lines.at(-1)).toBe('WhatsApp: +40 773 239 125');
  });
});

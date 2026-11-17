import { describe, expect, it } from 'vitest';
import { companyLine } from '../../src/company.js';

describe('companyLine', () => {
  it('stays empty until the legal name is filled in', () => {
    expect(companyLine({ legalName: ' ', taxId: 'RO1' })).toBe('');
  });

  it('joins the filled-in details', () => {
    expect(
      companyLine({
        legalName: 'Elite Custom Wrap SRL',
        registration: 'J12/1/2024',
        taxId: 'RO123',
        address: '',
      }),
    ).toBe('Elite Custom Wrap SRL · J12/1/2024 · CUI RO123');
  });
});

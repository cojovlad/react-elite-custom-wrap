// Legal company line for the footer (Law 365/2002). Empty while the details
// in src/config.js are not filled in.
import { COMPANY } from './config.js';

export function companyLine(company = COMPANY) {
  const value = (key) => company[key]?.trim();
  if (!value('legalName')) return '';
  return [
    value('legalName'),
    value('registration'),
    value('taxId') && `CUI ${value('taxId')}`,
    value('address'),
  ]
    .filter(Boolean)
    .join(' · ');
}

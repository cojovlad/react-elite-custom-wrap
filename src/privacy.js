// Privacy policy page: fills in the company and contact details from
// src/config.js and opens the English text for visitors not using Romanian.
import { COMPANY, CONTACT } from './config.js';
import { getLocale } from './i18n.js';

document.querySelectorAll('[data-company]').forEach((element) => {
  const value = COMPANY[element.dataset.company]?.trim();
  if (value) element.textContent = value;
});
document.querySelectorAll('[data-company-row]').forEach((row) => {
  row.hidden = !COMPANY[row.dataset.companyRow]?.trim();
});
document.querySelectorAll('[data-contact=email]').forEach((link) => {
  link.href = `mailto:${CONTACT.email}`;
  link.textContent = CONTACT.email;
});
document.querySelectorAll('[data-contact=phone]').forEach((link) => {
  link.href = `tel:+${CONTACT.whatsapp}`;
  link.textContent = CONTACT.whatsappDisplay;
});

if (!location.hash && getLocale() !== 'ro')
  document.getElementById('en').scrollIntoView();

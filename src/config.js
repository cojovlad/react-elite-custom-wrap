// Business contact settings, used by every WhatsApp link and the request form.
// email: requests are emailed through FormSubmit (https://formsubmit.co) when
// an address is set. FormSubmit needs a one-time activation: after the first
// request, open the confirmation email FormSubmit sends to this address and
// click "Activate Form". While email is empty, requests use WhatsApp only.
export const CONTACT = {
  whatsapp: '40773239125',
  whatsappDisplay: '+40 773 239 125',
  email: 'elite.custom_cluj@yahoo.com',
};

// Legal company details required by Law 365/2002 (footer) and named as the
// data controller in the privacy policy. Fill them in exactly as on the ONRC
// registration certificate; the footer line stays hidden while legalName is
// empty.
export const COMPANY = {
  legalName: '', // for example: 'Elite Custom Wrap SRL'
  registration: '', // Trade Register number, for example: 'J12/1234/2024'
  taxId: '', // CUI, for example: 'RO12345678'
  address: '', // registered office, for example: 'Str. Exemplu 1, Cluj-Napoca'
};

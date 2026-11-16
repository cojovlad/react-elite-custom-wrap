// Short status messages. The active one is re-translated on language change.
import { $ } from './dom.js';
import { t } from './i18n.js';
import { scheduleWhatsappYield } from './whatsapp-float.js';

let current;
let timer;

export function notify(key, params = {}) {
  current = { key, params };
  const toast = $('#toast');
  toast.textContent = t(key, params);
  toast.classList.add('visible');
  scheduleWhatsappYield();
  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    toast.classList.remove('visible');
    scheduleWhatsappYield();
  }, 6000);
}

export function translateToast() {
  if (current && $('#toast').classList.contains('visible'))
    $('#toast').textContent = t(current.key, current.params);
}

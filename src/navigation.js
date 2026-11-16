// Mobile menu and dialog chrome.
import { $ } from './dom.js';
import { t } from './i18n.js';

export function initNavigation(layout) {
  $('.menu-toggle').addEventListener('click', () => {
    const expanded = $('.menu-toggle').getAttribute('aria-expanded') === 'true';
    $('.menu-toggle').setAttribute('aria-expanded', String(!expanded));
    $('.menu-toggle').setAttribute(
      'aria-label',
      t(expanded ? 'Open navigation' : 'Close navigation'),
    );
    $('#mobile-nav').hidden = expanded;
    layout.measure($('#mobile-nav'));
  });
  $('#mobile-nav').addEventListener('click', (event) => {
    if (event.target.closest('a, button')) {
      $('#mobile-nav').hidden = true;
      $('.menu-toggle').setAttribute('aria-expanded', 'false');
      $('.menu-toggle').setAttribute('aria-label', t('Open navigation'));
    }
  });
  // A click on the backdrop, outside the dialog box, closes it.
  document.querySelectorAll('dialog').forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      const rect = dialog.getBoundingClientRect();
      if (
        event.target === dialog &&
        (event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom)
      )
        dialog.close();
    });
  });
  $('#close-dialog').addEventListener('click', () =>
    $('#consult-dialog').close(),
  );
  $('#close-share').addEventListener('click', () => $('#share-dialog').close());
  $('#credit-button').addEventListener('click', () => {
    $('#credit-dialog').showModal();
    layout.measure($('#credit-dialog'));
  });
  $('#close-credit').addEventListener('click', () =>
    $('#credit-dialog').close(),
  );
}

export function translateNavigation() {
  $('.menu-toggle').setAttribute(
    'aria-label',
    t($('#mobile-nav').hidden ? 'Open navigation' : 'Close navigation'),
  );
}

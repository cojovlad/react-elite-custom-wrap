// The studio photo grid and its full-screen viewer.
import { $ } from './dom.js';
import { t } from './i18n.js';

const SWIPE_PX = 45;

// Must run before the page is first translated: the English markup holds the
// message keys.
export function createWorkGallery(layout) {
  const dialog = $('#work-dialog');
  const image = $('#work-dialog-image');
  const photos = [...document.querySelectorAll('.work-item')].map((item) => {
    const img = item.querySelector('img');
    return {
      car: item.querySelector('.work-car').textContent.trim(),
      finish: item.querySelector('.work-finish').textContent.trim(),
      alt: img.getAttribute('alt'),
      src: img.getAttribute('src').replace('-480.', '-960.'),
      srcset: img.getAttribute('srcset'),
    };
  });
  let index = 0;

  function render(scope) {
    if (scope && !scope.contains(dialog)) return;
    const photo = photos[index];
    const pad = (value) => String(value).padStart(2, '0');
    $('#work-dialog-car').textContent = photo.car;
    $('#work-dialog-finish').textContent = t(photo.finish);
    $('#work-dialog-count').textContent =
      `${pad(index + 1)} / ${pad(photos.length)}`;
    image.alt = t(photo.alt);
  }

  function show(next) {
    index = (next + photos.length) % photos.length;
    const photo = photos[index];
    image.classList.add('is-loading');
    image.removeAttribute('srcset');
    image.src = photo.src;
    image.srcset = photo.srcset;
    render();
    // Warms the neighbours, so stepping through feels instant.
    [index - 1, index + 1].forEach((neighbour) => {
      const preload = new Image();
      preload.sizes = image.sizes;
      preload.srcset =
        photos[(neighbour + photos.length) % photos.length].srcset;
    });
  }

  image.sizes = '(orientation: landscape) 62vh, 100vw';
  image.addEventListener('load', () => image.classList.remove('is-loading'));
  document.querySelectorAll('[data-work-index]').forEach((button) =>
    button.addEventListener('click', () => {
      show(Number(button.dataset.workIndex));
      dialog.showModal();
      layout.measure(dialog);
    }),
  );
  $('#work-prev').addEventListener('click', () => show(index - 1));
  $('#work-next').addEventListener('click', () => show(index + 1));
  $('#close-work').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') show(index - 1);
    else if (event.key === 'ArrowRight') show(index + 1);
  });
  const stage = dialog.querySelector('.work-stage');
  let start = null;
  stage.addEventListener('pointerdown', (event) => {
    if (event.isPrimary) start = { x: event.clientX, y: event.clientY };
  });
  stage.addEventListener('pointerup', (event) => {
    if (!start || !event.isPrimary) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    start = null;
    if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy) * 1.4)
      show(dx < 0 ? index + 1 : index - 1);
    else if (event.target === stage && event.pointerType === 'mouse')
      dialog.close();
  });
  stage.addEventListener('pointercancel', () => {
    start = null;
  });
  return { render };
}

// The floating WhatsApp button steps aside while it would cover essential
// controls or a notification, and returns once they scroll away.
import { $ } from './dom.js';

const YIELD_TO = [
  '.vehicle-tabs',
  '.catalog-controls',
  '.view-tabs',
  '.stage-actions',
  '.panel-heading',
  '.design-panel .control-group',
  '.apply-all',
  '.design-cta',
  '.panel-footer',
  '.config-foot',
  '.service-card .text-link',
  '.price-lines-toggle',
  '.price-from',
  '.faq summary',
  '.contact-actions',
  '.footer',
  '.toast.visible',
].join(', ');
const MAX_LIFT = 160;
let frame = 0;

// First tries lifting the button just above whatever it would cover; only when
// no clear spot is near does it fade away.
function update() {
  frame = 0;
  const float = $('#whatsapp-float');
  if (float.hidden || getComputedStyle(float).display === 'none') return;
  const style = getComputedStyle(float);
  const width = float.offsetWidth;
  const height = float.offsetHeight;
  const right = document.documentElement.clientWidth - parseFloat(style.right);
  const bottom =
    document.documentElement.clientHeight - parseFloat(style.bottom);
  const gap = 8;
  const rects = [...document.querySelectorAll(YIELD_TO)]
    .map((element) => element.getBoundingClientRect())
    .filter(
      (rect) =>
        rect.width > 0 && rect.left < right && rect.right > right - width,
    );
  const blockers = (lift) =>
    rects.filter(
      (rect) =>
        rect.top < bottom - lift + gap &&
        rect.bottom > bottom - lift - height - gap,
    );
  let lift = 0;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const blocking = blockers(lift);
    if (!blocking.length) break;
    lift = bottom - Math.min(...blocking.map((rect) => rect.top)) + gap;
  }
  const clear = lift <= MAX_LIFT && !blockers(lift).length;
  // The contact section has its own WhatsApp button, so one is enough there.
  const contact = $('.contact-section');
  const atContact =
    contact &&
    contact.getBoundingClientRect().top <
      document.documentElement.clientHeight * 0.85;
  const shown = clear && !atContact;
  float.style.setProperty('--lift', `${shown ? -lift : 0}px`);
  float.classList.toggle('is-yielding', !shown);
}

export function scheduleWhatsappYield() {
  if (!frame) frame = requestAnimationFrame(update);
}

export function initWhatsappFloat() {
  window.addEventListener('resize', scheduleWhatsappYield);
  window.addEventListener('scroll', scheduleWhatsappYield, { passive: true });
  // Late layout changes (fonts, reserved language sizes, models) move controls
  // without scrolling.
  const observer = new ResizeObserver(scheduleWhatsappYield);
  ['body', '.config-layout', '.design-panel'].forEach((selector) =>
    observer.observe($(selector)),
  );
  $('#whatsapp-float-close').addEventListener('click', () => {
    // Hidden for this page view only; a reload shows it again.
    $('#whatsapp-float').hidden = true;
  });
}

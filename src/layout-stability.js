// Reserves the largest geometry any supported language needs at the current
// viewport width, so switching languages never moves or resizes the layout.
// Every locale is rendered synchronously inside one task and restored before
// the browser paints, so the measurement is never visible. Reservations do not
// depend on the active locale, so a language switch needs no new measurement.
// render(locale, scope) must render visible localized text, limited to scope
// when one is given.
const WIDTH_TARGETS = [
  '.skip-link',
  '.desktop-nav a',
  '.header-cta',
  '.config-top-note',
  '#catalog-count',
  '.view-tabs button',
  '.drag-hint',
  '.studio-signature > span',
  '.palette-caption',
  '.reset-link',
  '.design-summary > span',
  '.panel-footer > *',
  '#other-vehicle',
  '.hero-intro .text-link',
  '.brand-strip > span',
  '.section-head > p',
  '.contact-section .button',
  '.contact-links a',
  '.footer > p',
  '.brief-success .button',
].join(', ');
const IGNORED = 'script, style, select, textarea, .sr-only, .toast';
const INLINE = new Set(['inline', 'contents']);
const TOLERANCE = 0.5;
export const SETTLE_MS = 120;

export function createLayoutStability({
  root = document.body,
  locales,
  getLocale,
  render,
}) {
  const reserved = new Set();
  let frame = 0;
  let timer = 0;
  let pendingScope = null;
  let measuredWidth = 0;
  const visible = (element) => element.getClientRects().length > 0;

  // The nearest box-generating ancestor of each visible text node.
  function textContainers(scope) {
    const containers = new Set();
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      let element = node.parentElement;
      if (!node.nodeValue.trim() || element.closest(IGNORED)) continue;
      while (element !== root && INLINE.has(getComputedStyle(element).display))
        element = element.parentElement;
      if (visible(element)) containers.add(element);
    }
    return [...containers];
  }

  // Each group is [elements, style property, rect dimension]. All groups are
  // sampled from the same render of every locale.
  function reserve(groups, scope, partial) {
    const ranges = groups.map(([elements]) =>
      elements.map(() => ({ min: Infinity, max: 0 })),
    );
    for (const locale of locales) {
      // Hyphenation follows the language, so a partial render carries it.
      if (partial) scope.lang = locale;
      render(locale, partial ? scope : null);
      groups.forEach(([elements, , dimension], group) =>
        elements.forEach((element, index) => {
          const range = ranges[group][index];
          const value = element.getBoundingClientRect()[dimension];
          range.min = Math.min(range.min, value);
          range.max = Math.max(range.max, value);
        }),
      );
    }
    let changed = false;
    groups.forEach(([elements, property], group) =>
      ranges[group].forEach(({ min, max }, index) => {
        const element = elements[index];
        const current = parseFloat(element.style[property]) || 0;
        if (max - min > TOLERANCE && max > current + TOLERANCE) {
          element.style[property] = `${max}px`;
          reserved.add(element);
          changed = true;
        }
      }),
    );
    return changed;
  }

  // A scope (an opened dialog, menu or FAQ answer) re-measures only content
  // whose size cannot affect the rest of the page.
  function measure(scope = root) {
    const partial = scope !== root;
    if (!partial) {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      frame = 0;
      pendingScope = null;
    }
    if (!visible(scope)) return;
    const active = getLocale();
    const { scrollX, scrollY } = window;
    const html = document.documentElement;
    html.classList.add('layout-measuring');
    reserved.forEach((element) => {
      if (!scope.contains(element)) return;
      element.style.minWidth = '';
      element.style.minHeight = '';
      reserved.delete(element);
    });
    if (!partial) measuredWidth = html.clientWidth;
    const widthTargets = [...scope.querySelectorAll(WIDTH_TARGETS)];
    // Later passes settle containers whose reserved children changed size.
    for (let pass = 0; pass < 3; pass += 1) {
      const groups = [[textContainers(scope), 'minHeight', 'height']];
      if (!pass)
        groups.push([widthTargets.filter(visible), 'minWidth', 'width']);
      if (!reserve(groups, scope, partial)) break;
    }
    render(active, partial ? scope : null);
    if (partial) scope.removeAttribute('lang');
    html.classList.remove('layout-measuring');
    if (window.scrollX !== scrollX || window.scrollY !== scrollY)
      window.scrollTo({ left: scrollX, top: scrollY, behavior: 'instant' });
  }

  // Measures before the next paint, optionally after a quiet period. Existing
  // reservations remain floors in the meantime. Different pending scopes
  // merge into a whole-page measurement.
  function schedule(delay = 0, scope = root) {
    pendingScope = pendingScope && !pendingScope.contains(scope) ? root : scope;
    clearTimeout(timer);
    if (delay) {
      timer = setTimeout(() => schedule(0, pendingScope), delay);
      return;
    }
    if (!frame)
      frame = requestAnimationFrame(() => {
        const target = pendingScope;
        frame = 0;
        pendingScope = null;
        measure(target);
      });
  }

  // Only width changes alter line wrapping; mobile toolbars resize the height.
  window.addEventListener('resize', () => {
    if (document.documentElement.clientWidth !== measuredWidth)
      schedule(SETTLE_MS);
  });
  document.addEventListener(
    'toggle',
    (event) => {
      if (event.target instanceof HTMLDetailsElement && event.target.open)
        measure(event.target);
    },
    true,
  );
  document.fonts.addEventListener('loadingdone', schedule);
  document.fonts.ready.then(schedule);
  return { measure, schedule };
}

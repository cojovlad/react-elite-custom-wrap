// Google reviews from src/reviews.json (filled by `npm run reviews`), floated
// as an endless carousel. It pauses for hover, focus, touch and the pause
// button, and never moves on its own with reduced motion.
import REVIEWS from './reviews.json';
import { $, reducedMotion } from './dom.js';
import { getLocale, t } from './i18n.js';

const SPEED = 26;
const RESUME_MS = 3500;
const STEP_MS = 520;
const MIN_FLOATING = 3;

export function usableReviews(list = []) {
  return list
    .filter(
      (review) =>
        typeof review?.author === 'string' &&
        review.author.trim() &&
        typeof review.text === 'string' &&
        review.text.trim() &&
        Number(review.rating) >= 1 &&
        Number(review.rating) <= 5,
    )
    .sort((a, b) => (Date.parse(b.time) || 0) - (Date.parse(a.time) || 0));
}

export function initials(name) {
  return [...name.trim()][0]?.toUpperCase() || '?';
}

// Relative, like Google itself ("2 weeks ago"), so hand-added reviews only
// need the approximate day Google shows.
export function reviewDate(time, locale, now = Date.now()) {
  const date = Date.parse(time);
  if (Number.isNaN(date)) return '';
  const days = Math.max(0, Math.floor((now - date) / 86400000));
  if (!days)
    return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(
      0,
      'day',
    );
  const format = new Intl.RelativeTimeFormat(locale);
  if (days < 7) return format.format(-days, 'day');
  if (days < 30) return format.format(-Math.floor(days / 7), 'week');
  if (days < 365)
    return format.format(-Math.max(1, Math.floor(days / 30.44)), 'month');
  return format.format(-Math.floor(days / 365.25), 'year');
}

// Only Google's own profile photo and review hosts are trusted.
const safeUrl = (value, hosts) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' &&
      hosts.some(
        (host) => url.hostname === host || url.hostname.endsWith(`.${host}`),
      )
      ? url.href
      : '';
  } catch {
    return '';
  }
};
// Hand-added reviews keep the reviewer's Google photo in public/reviews/.
const localPhoto = (value) =>
  /^\/reviews\/[\w-]+\.(?:png|webp|jpe?g)$/.test(value ?? '') ? value : '';
const PHOTO_HOSTS = ['googleusercontent.com'];
const LINK_HOSTS = ['google.com', 'maps.app.goo.gl'];
const AVATAR_TONES = [
  '#8a5a44',
  '#4f6d5e',
  '#5b5f86',
  '#86713f',
  '#7a4f6b',
  '#3f6f80',
];

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function createAvatar(review) {
  const letter = element('span', 'review-avatar', initials(review.author));
  letter.setAttribute('aria-hidden', 'true');
  const hash = [...review.author].reduce(
    (sum, char) => sum + char.codePointAt(0),
    0,
  );
  letter.style.background = AVATAR_TONES[hash % AVATAR_TONES.length];
  const photo = localPhoto(review.photo) || safeUrl(review.photo, PHOTO_HOSTS);
  if (!photo) return letter;
  const image = element('img', 'review-avatar');
  image.alt = '';
  image.width = 36;
  image.height = 36;
  image.loading = 'lazy';
  image.decoding = 'async';
  image.referrerPolicy = 'no-referrer';
  image.src = photo;
  image.addEventListener('error', () => image.replaceWith(letter), {
    once: true,
  });
  return image;
}

export function createReviewCard(review, index) {
  const rating = Math.round(Number(review.rating));
  const card = element('li', 'review-card');
  card.dataset.review = String(index);
  const url = safeUrl(review.url, LINK_HOSTS);
  const body = element(url ? 'a' : 'div', 'review-body');
  if (url) {
    body.href = url;
    body.target = '_blank';
    body.rel = 'noopener noreferrer';
  }
  const head = element('div', 'review-head');
  const who = element('span', 'review-who');
  const date = element('time', 'review-date');
  if (!Number.isNaN(Date.parse(review.time))) date.dateTime = review.time;
  who.append(element('span', 'review-name', review.author.trim()), date);
  const google = element('span', 'review-google', 'G');
  google.setAttribute('aria-hidden', 'true');
  head.append(createAvatar(review), who, google);
  const stars = element('span', 'review-stars', '★'.repeat(rating));
  stars.setAttribute('role', 'img');
  stars.append(element('span', 'review-stars-off', '★'.repeat(5 - rating)));
  const text = element('p', 'review-text', review.text.trim());
  if (review.language) text.lang = review.language;
  body.append(head, stars, text);
  card.append(body);
  return card;
}

export function renderReviewCard(card, review, locale) {
  card
    .querySelector('.review-stars')
    .setAttribute(
      'aria-label',
      t('{rating} out of 5 stars', { rating: Math.round(review.rating) }),
    );
  card.querySelector('.review-date').textContent = reviewDate(
    review.time,
    locale,
  );
}

function createFloat(section, viewport, track) {
  const originals = [...track.children];
  const toggle = $('#reviews-toggle');
  let offset = 0;
  let period = 0;
  let step = 0;
  let last = 0;
  let frame = 0;
  let width = 0;
  let paused = reducedMotion();
  let hovering = false;
  let focused = false;
  let holdUntil = 0;
  let drag = null;
  let tween = null;
  let dragged = false;

  const apply = () => {
    if (period) offset = ((offset % period) + period) % period;
    track.style.transform = `translate3d(${-offset}px, 0, 0)`;
  };

  // Enough copies follow the real cards to fill the viewport while the first
  // set scrolls out, so the loop has no seam.
  function build() {
    width = viewport.clientWidth;
    track.querySelectorAll('[data-clone]').forEach((clone) => clone.remove());
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    period = originals.reduce((sum, card) => sum + card.offsetWidth + gap, 0);
    step = period / originals.length;
    const copies = Math.max(1, Math.ceil(width / Math.max(period, 1)));
    for (let copy = 0; copy < copies; copy += 1)
      originals.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.dataset.clone = '';
        clone.setAttribute('aria-hidden', 'true');
        clone.inert = true;
        track.append(clone);
      });
    apply();
  }

  function tick(time) {
    const elapsed = last ? Math.min(64, time - last) : 0;
    last = time;
    if (tween) {
      const progress = Math.min(1, (time - tween.start) / STEP_MS);
      offset = tween.from + (tween.to - tween.from) * (1 - (1 - progress) ** 3);
      if (progress >= 1) tween = null;
    } else if (!paused && !hovering && !focused && !drag && time >= holdUntil)
      offset += (SPEED * elapsed) / 1000;
    apply();
    frame = requestAnimationFrame(tick);
  }
  const start = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };
  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
  };
  const hold = () => {
    holdUntil = performance.now() + RESUME_MS;
  };

  function move(direction) {
    const base = tween ? tween.to : offset;
    const to = (Math.round(base / step) + direction) * step;
    hold();
    if (reducedMotion()) {
      tween = null;
      offset = to;
      apply();
    } else tween = { from: offset, to, start: performance.now() };
  }

  function renderToggle() {
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute(
      'aria-label',
      t(paused ? 'Play reviews' : 'Pause reviews'),
    );
    toggle.classList.toggle('is-paused', paused);
  }

  $('#reviews-prev').addEventListener('click', () => move(-1));
  $('#reviews-next').addEventListener('click', () => move(1));
  toggle.addEventListener('click', () => {
    paused = !paused;
    renderToggle();
  });
  viewport.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') hovering = true;
  });
  viewport.addEventListener('pointerleave', () => {
    hovering = false;
  });
  viewport.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    tween = null;
    drag = { x: event.clientX, offset, moved: false };
  });
  // Captured only once it is a real drag, so a plain click still opens a review.
  viewport.addEventListener('pointermove', (event) => {
    if (!drag) return;
    const distance = event.clientX - drag.x;
    if (!drag.moved) {
      if (Math.abs(distance) <= 6) return;
      drag.moved = true;
      viewport.setPointerCapture(event.pointerId);
      viewport.classList.add('is-dragging');
    }
    offset = drag.offset - distance;
    apply();
  });
  viewport.addEventListener('dragstart', (event) => event.preventDefault());
  // Keyboard focus would scroll the clipped viewport; slide the card in instead.
  track.addEventListener('focusin', (event) => {
    const card = event.target.closest('.review-card');
    if (!card) return;
    viewport.scrollLeft = 0;
    const padding = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    tween = null;
    offset +=
      card.getBoundingClientRect().left -
      viewport.getBoundingClientRect().left -
      padding;
    apply();
  });
  const release = () => {
    if (!drag) return;
    dragged = drag.moved;
    drag = null;
    viewport.classList.remove('is-dragging');
    hold();
  };
  viewport.addEventListener(
    'click',
    (event) => {
      if (dragged) event.preventDefault();
      dragged = false;
    },
    true,
  );
  viewport.addEventListener('pointerup', release);
  viewport.addEventListener('pointercancel', release);
  viewport.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') move(-1);
    else if (event.key === 'ArrowRight') move(1);
  });
  section.addEventListener('focusin', () => {
    focused = true;
  });
  section.addEventListener('focusout', (event) => {
    focused = section.contains(event.relatedTarget);
  });
  new ResizeObserver(() => {
    if (viewport.clientWidth !== width) build();
  }).observe(viewport);
  new IntersectionObserver(([entry]) =>
    entry.isIntersecting && !document.hidden ? start() : stop(),
  ).observe(viewport);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
  });
  build();
  renderToggle();
  return { renderToggle };
}

export function createReviews(data = REVIEWS) {
  const section = $('#reviews');
  // Reviews without their own link open the studio's Google reviews.
  const reviews = usableReviews(data.reviews).map((review) => ({
    ...review,
    url: review.url || data.source,
  }));
  const carousel = $('#reviews-carousel');
  const viewport = carousel.querySelector('.reviews-viewport');
  const track = $('#reviews-track');
  let floating = null;

  if (reviews.length) {
    track.append(...reviews.map(createReviewCard));
    carousel.hidden = false;
    section.classList.add('has-reviews');
    if (reviews.length >= MIN_FLOATING && 'IntersectionObserver' in window)
      floating = createFloat(section, viewport, track);
    else carousel.classList.add('is-static');
  }

  function render(scope) {
    if (scope && !scope.contains(section)) return;
    const locale = getLocale();
    track
      .querySelectorAll('.review-card')
      .forEach((card) =>
        renderReviewCard(card, reviews[card.dataset.review], locale),
      );
    floating?.renderToggle();
  }
  return { render };
}

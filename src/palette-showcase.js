// Signature palettes section: finish chips, card art and the slow rotation
// that suggests a new finish every few seconds while the section is on screen.
import { $, reducedMotion } from './dom.js';
import { getLocale, t } from './i18n.js';
import { MATERIALS } from './materials.js';
import { PALETTE_BY_ID, PALETTE_DIRECTIONS, paletteArt } from './palettes.js';

const FADE_MS = 260;
let direction = PALETTE_DIRECTIONS[0];
let autoplay = false;
let visible = false;
let held = false;
let fadeTimer = 0;

const cards = () => [...document.querySelectorAll('.palette-card')];

function caption(palette, index) {
  if (palette.caption) return t(palette.caption);
  const finish = t(MATERIALS[palette.material].label);
  return `0${index + 1} / ${palette.ppf ? 'PPF · ' : ''}${finish}`.toLocaleUpperCase(
    getLocale(),
  );
}

export function renderPaletteText(scope) {
  cards().forEach((card, index) => {
    if (scope && !scope.contains(card)) return;
    const palette = direction.palettes[index];
    card.querySelector('.palette-caption').textContent = caption(
      palette,
      index,
    );
    card.querySelector('h3').textContent = t(palette.title);
    card.querySelector('.palette-description > span').textContent = t(
      palette.description,
    );
  });
}

function renderCards() {
  cards().forEach((card, index) => {
    const palette = direction.palettes[index];
    const art = paletteArt(palette);
    card.dataset.preset = palette.id;
    const box = card.querySelector('.palette-art');
    box.className = `palette-art ${art.className ?? 'palette-custom'}`;
    box.classList.toggle('is-dark', Boolean(art.dark));
    box.style.background = art.background ?? '';
    card.querySelector('.palette-fold').style.background = art.fold ?? '';
    card.querySelector('.palette-dots').replaceChildren(
      ...art.dots.map((hex) => {
        const dot = document.createElement('span');
        dot.style.background = hex;
        return dot;
      }),
    );
  });
  renderPaletteText();
}

function showDirection(id, { animate = true } = {}) {
  const next = PALETTE_DIRECTIONS.find((item) => item.id === id);
  if (!next || next === direction) return;
  direction = next;
  document.querySelectorAll('[data-palette-direction]').forEach((button) => {
    const active = button.dataset.paletteDirection === id;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  const grid = $('.collection-grid');
  clearTimeout(fadeTimer);
  if (!animate || reducedMotion()) {
    grid.classList.remove('is-changing');
    renderCards();
    return;
  }
  grid.classList.add('is-changing');
  fadeTimer = setTimeout(() => {
    renderCards();
    grid.classList.remove('is-changing');
  }, FADE_MS);
}

function updatePlayback() {
  const chips = $('.palette-directions');
  chips.classList.toggle('is-playing', autoplay);
  chips.classList.toggle('is-paused', !visible || held);
}

export const paletteFilms = (id) => PALETTE_BY_ID.get(id)?.films;

export function initPaletteShowcase() {
  const section = $('#collection');
  const chips = $('.palette-directions');
  autoplay = !reducedMotion();
  renderCards();
  chips.addEventListener('click', (event) => {
    const button = event.target.closest('[data-palette-direction]');
    if (!button) return;
    // The visitor chose a finish, so stop suggesting others.
    autoplay = false;
    updatePlayback();
    showDirection(button.dataset.paletteDirection);
  });
  chips.addEventListener('animationend', (event) => {
    if (event.animationName !== 'palette-progress' || !autoplay) return;
    const index = PALETTE_DIRECTIONS.indexOf(direction);
    showDirection(
      PALETTE_DIRECTIONS[(index + 1) % PALETTE_DIRECTIONS.length].id,
    );
  });
  // Pause while the visitor is looking at or using the cards.
  const hold = (value) => () => {
    held = value;
    updatePlayback();
  };
  section.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') hold(true)();
  });
  section.addEventListener('pointerleave', hold(false));
  section.addEventListener('focusin', hold(true));
  section.addEventListener('focusout', (event) => {
    if (!section.contains(event.relatedTarget)) hold(false)();
  });
  if ('IntersectionObserver' in window)
    new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        updatePlayback();
      },
      { threshold: 0.35 },
    ).observe(section);
  else visible = true;
  updatePlayback();
}

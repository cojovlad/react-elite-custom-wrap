import { beforeAll, describe, expect, it, vi } from 'vitest';
import { loadTranslations, setLocale } from '../../src/i18n.js';

const markup = `
  <section id="reviews">
    <p id="reviews-summary">Every review is published on Google,</p>
    <div id="reviews-carousel" hidden>
      <div class="reviews-viewport"><ul id="reviews-track"></ul></div>
      <button id="reviews-prev"></button><button id="reviews-toggle"></button
      ><button id="reviews-next"></button>
    </div>
  </section>`;

const review = (author, time, extra = {}) => ({
  author,
  rating: 5,
  text: `${author} wrote this.`,
  time,
  ...extra,
});

let reviews;
beforeAll(async () => {
  await loadTranslations();
  window.matchMedia = () => ({ matches: false });
  reviews = await import('../../src/reviews.js');
});

describe('reviews', () => {
  it('keeps complete reviews, newest first', () => {
    const list = reviews.usableReviews([
      review('Old', '2025-01-01T00:00:00Z'),
      { author: 'No text', rating: 5, text: ' ' },
      review('Bad rating', '2026-01-01T00:00:00Z', { rating: 9 }),
      review('New', '2026-05-01T00:00:00Z'),
    ]);
    expect(list.map(({ author }) => author)).toEqual(['New', 'Old']);
  });

  it('builds a card with initial, date and only Google links', () => {
    const card = reviews.createReviewCard(
      review('ana pop', '2025-11-20T10:00:00Z', {
        rating: 4,
        url: 'https://www.google.com/maps/reviews/x',
        photo: 'https://evil.example/photo.png',
      }),
      0,
    );
    reviews.renderReviewCard(
      card,
      { rating: 4, time: '2025-11-20T10:00:00Z' },
      'ro',
    );
    expect(card.querySelector('a.review-body').href).toBe(
      'https://www.google.com/maps/reviews/x',
    );
    expect(card.querySelector('img')).toBeNull();
    expect(card.querySelector('.review-avatar').textContent).toBe('A');
    expect(card.querySelector('.review-date').textContent).not.toBe('');
    expect(card.querySelector('.review-stars').textContent).toBe('★★★★★');
    const unsafe = reviews.createReviewCard(
      review('X', '', { url: 'javascript:alert(1)' }),
      1,
    );
    expect(unsafe.querySelector('a')).toBeNull();
    const local = reviews.createReviewCard(
      review('Ion', '', { photo: '/reviews/ion.png' }),
      2,
    );
    expect(local.querySelector('img').getAttribute('src')).toBe(
      '/reviews/ion.png',
    );
    const outside = reviews.createReviewCard(
      review('Ion', '', { photo: '/reviews/../secret.png' }),
      3,
    );
    expect(outside.querySelector('img')).toBeNull();
  });

  it('dates reviews the way Google does', () => {
    const now = Date.parse('2026-11-17T09:00:00Z');
    const date = (time, locale = 'en') => reviews.reviewDate(time, locale, now);
    expect(date('2026-11-17T08:00:00Z')).toBe('today');
    expect(date('2026-11-14')).toBe('3 days ago');
    expect(date('2026-11-10')).toBe('1 week ago');
    expect(date('2026-11-03', 'ro')).toBe('acum 2 săptămâni');
    expect(date('2026-06-17')).toBe('5 months ago');
    expect(date('2024-10-01')).toBe('2 years ago');
    expect(date('not a date')).toBe('');
  });

  it('shows the carousel without a fixed rating when there are reviews', () => {
    document.body.innerHTML = markup;
    setLocale('ro', { persist: false });
    const view = reviews.createReviews({
      source: 'https://www.google.com/maps/search/?api=1&query=x',
      rating: 4.9,
      count: 38,
      reviews: [review('Ana', '2026-01-01'), review('Ion', '2026-02-01')],
    });
    view.render();
    expect(document.querySelector('.review-body').href).toBe(
      'https://www.google.com/maps/search/?api=1&query=x',
    );
    expect(document.querySelector('#reviews-carousel').hidden).toBe(false);
    expect(document.querySelectorAll('.review-card')).toHaveLength(2);
    expect(
      document
        .querySelector('#reviews-carousel')
        .classList.contains('is-static'),
    ).toBe(true);
    expect(document.querySelector('#reviews-summary').textContent).toBe(
      'Every review is published on Google,',
    );
  });

  it('floats three or more reviews with hidden copies', () => {
    document.body.innerHTML = markup;
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe() {}
      },
    );
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
      },
    );
    reviews.createReviews({
      reviews: ['A', 'B', 'C'].map((name) => review(name, '2026-01-01')),
    });
    const clones = document.querySelectorAll('[data-clone]');
    expect(clones.length).toBeGreaterThanOrEqual(3);
    clones.forEach((clone) =>
      expect(clone.getAttribute('aria-hidden')).toBe('true'),
    );
    vi.unstubAllGlobals();
  });

  it('keeps the Google links when there are no reviews', () => {
    document.body.innerHTML = markup;
    reviews.createReviews({ reviews: [] }).render();
    expect(document.querySelector('#reviews-carousel').hidden).toBe(true);
    expect(document.querySelector('#reviews-summary').textContent).toBe(
      'Every review is published on Google,',
    );
  });
});

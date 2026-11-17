// Pulls the studio's Google reviews into src/reviews.json, where the reviews
// carousel reads them. Google's Places API returns at most five reviews per
// request (the most relevant ones), so every run is merged with the reviews
// already saved: the carousel grows over time and keeps hand-added entries.
//
// Usage: GOOGLE_PLACES_API_KEY=... node scripts/fetch-reviews.mjs
// Without a key it leaves the file untouched, so builds never depend on it.
import { readFile, writeFile } from 'node:fs/promises';

const PLACE_ID = 'ChIJwdTFXg0LSUcRJOha7a3XNB0';
const FILE = new URL('../src/reviews.json', import.meta.url);
const key = process.env.GOOGLE_PLACES_API_KEY;

if (!key) {
  console.log(
    'reviews: GOOGLE_PLACES_API_KEY is not set, keeping src/reviews.json',
  );
  process.exit(0);
}

// Hand-added reviews have no link, so a reviewer is matched by name: the
// Google copy then replaces it (exact date, link) instead of duplicating it.
const identity = (review) =>
  (review.author ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase() || review.url;
const filled = (review) =>
  Object.fromEntries(Object.entries(review).filter(([, value]) => value));

try {
  const response = await fetch(
    `https://places.googleapis.com/v1/places/${PLACE_ID}`,
    {
      headers: {
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': 'googleMapsUri,reviews',
      },
      signal: AbortSignal.timeout(15000),
    },
  );
  if (!response.ok)
    throw new Error(`${response.status} ${await response.text()}`);
  const place = await response.json();
  const saved = JSON.parse(await readFile(FILE, 'utf8'));
  const fresh = (place.reviews ?? []).map((review) => ({
    author: review.authorAttribution?.displayName ?? '',
    photo: review.authorAttribution?.photoUri ?? '',
    rating: review.rating,
    text: review.originalText?.text ?? review.text?.text ?? '',
    language:
      review.originalText?.languageCode ?? review.text?.languageCode ?? '',
    time: review.publishTime,
    url: review.googleMapsUri ?? '',
  }));
  const merged = new Map(
    (saved.reviews ?? []).map((review) => [identity(review), review]),
  );
  fresh.forEach((review) => {
    const key = identity(review);
    merged.set(key, { ...merged.get(key), ...filled(review) });
  });
  const reviews = [...merged.values()]
    .filter((review) => review.author && review.text)
    .sort((a, b) => (Date.parse(b.time) || 0) - (Date.parse(a.time) || 0));
  const next = {
    source: place.googleMapsUri ?? saved.source,
    updated: new Date().toISOString().slice(0, 10),
    reviews,
  };
  await writeFile(FILE, `${JSON.stringify(next, null, 2)}\n`);
  console.log(`reviews: ${fresh.length} fetched, ${reviews.length} saved`);
} catch (error) {
  // A failed refresh keeps the last good reviews; it never breaks a build.
  console.warn(`reviews: could not refresh (${error.message})`);
}

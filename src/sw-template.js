// Service worker template. The build (vite.config.js) replaces the two
// placeholders and writes the result to dist/sw.js.
//
// Cache-first for files that never change under the same name: hashed build
// assets, and models, decoders and fonts keyed by their content hash. HTML and
// every other request go straight to the network, unchanged.
const FILES = self.__FILES__; // path -> content hash (models, decoders, fonts)
const ASSETS = new Set(self.__ASSETS__); // current hashed /assets/ paths
const FILE_CACHE = 'ecw-files-v1';
const ASSET_CACHE = 'ecw-assets-v1';
const MAX_MODELS = 12;

const keyFor = (path) =>
  FILES[path]
    ? new Request(`${path}?v=${FILES[path]}`)
    : ASSETS.has(path)
      ? new Request(path)
      : null;
const cacheFor = (path) => (FILES[path] ? FILE_CACHE : ASSET_CACHE);

// Keeps phones from filling up: only the most recently added models stay.
async function trimModels(cache) {
  const models = (await cache.keys()).filter((request) =>
    new URL(request.url).pathname.startsWith('/models/'),
  );
  await Promise.all(
    models
      .slice(0, Math.max(0, models.length - MAX_MODELS))
      .map((request) => cache.delete(request)),
  );
}

async function store(path, response) {
  if (response.status !== 200 || response.type !== 'basic') return;
  try {
    const cache = await caches.open(cacheFor(path));
    await cache.put(keyFor(path), response);
    if (path.startsWith('/models/')) await trimModels(cache);
  } catch (error) {
    // A full disk only means this file is not cached.
    console.warn('Not cached:', path, error);
  }
}

async function cacheFirst(event, path) {
  const cached = await caches.match(keyFor(path));
  if (cached) return cached;
  const response = await fetch(event.request);
  event.waitUntil(store(path, response.clone()));
  return response;
}

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const valid = (request) => {
        const url = new URL(request.url);
        return (
          FILES[url.pathname] === url.searchParams.get('v') ||
          ASSETS.has(url.pathname)
        );
      };
      for (const name of [FILE_CACHE, ASSET_CACHE]) {
        const cache = await caches.open(name);
        for (const request of await cache.keys())
          if (!valid(request)) await cache.delete(request);
      }
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || request.headers.has('range')) return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.search) return;
  if (!keyFor(url.pathname)) return;
  event.respondWith(cacheFirst(event, url.pathname));
});

// The page reports files it loaded before this worker was active.
self.addEventListener('message', (event) => {
  if (event.data?.type !== 'cache') return;
  event.waitUntil(
    (async () => {
      for (const href of event.data.urls ?? []) {
        const url = new URL(href);
        if (url.origin !== self.location.origin || url.search) continue;
        const key = keyFor(url.pathname);
        if (!key || (await caches.match(key))) continue;
        try {
          await store(url.pathname, await fetch(url.pathname));
        } catch {
          // Offline; the file is cached on its next use instead.
        }
      }
    })(),
  );
});

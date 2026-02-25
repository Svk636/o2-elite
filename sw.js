/* ════════════════════════════════════════════════════
   O2 Elite · Service Worker
   Strategy: Cache-first for assets, network-first for HTML
   Version: bump CACHE_VERSION to force update
════════════════════════════════════════════════════ */

const CACHE_VERSION = 'o2elite-v1.2.0';
const CACHE_STATIC  = CACHE_VERSION + '-static';

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.svg',
  './icons/icon-72.svg',
  './icons/icon-96.svg',
  './icons/icon-128.svg',
  './icons/icon-144.svg',
  './icons/icon-152.svg',
  './icons/icon-192.svg',
  './icons/icon-384.svg',
  './icons/icon-512.svg',
];

/* ── INSTALL: precache all static assets ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

/* ── ACTIVATE: delete old cache versions ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_STATIC)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

/* ── FETCH: cache-first with network fallback ── */
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip cross-origin requests (e.g. Google Fonts)
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) {
    // For fonts: try network, fall back to cache
    if (url.hostname.includes('fonts.g')) {
      event.respondWith(
        fetch(event.request)
          .then(res => {
            const clone = res.clone();
            caches.open(CACHE_STATIC).then(c => c.put(event.request, clone));
            return res;
          })
          .catch(() => caches.match(event.request))
      );
    }
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(res => {
        // Cache valid responses
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_STATIC).then(c => c.put(event.request, clone));
        }
        return res;
      }).catch(() => {
        // Offline fallback: serve index.html for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

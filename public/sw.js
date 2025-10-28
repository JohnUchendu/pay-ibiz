const CACHE = 'qrpay-v1';
const OFFLINE = '/offline.html';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll([
      '/', '/create', '/pay', '/manifest.json', OFFLINE
    ]))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
      .catch(() => caches.match(OFFLINE))
  );
});
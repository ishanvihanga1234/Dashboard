const CACHE = 'sl-dashboard-shell-v1';
const SHELL = ['./index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

// Network-first for everything, so live data (Excel file, CDNs) is always
// fetched fresh when online; falls back to the cached shell if offline.
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

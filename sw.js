// Service worker: caches the app shell so the app installs and works offline.
// Bump CACHE when the shell changes to invalidate the old cache.
const CACHE = 'engdept-v2';
const ASSETS = [
    '.',
    'index.html',
    'app.js',
    'firebase.js',
    'manifest.webmanifest',
    'icon-192.png',
    'icon-512.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE)
            .then((cache) => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;

    const url = new URL(req.url);
    // Let cross-origin requests (e.g. the Firebase CDN) go straight to the network.
    if (url.origin !== self.location.origin) return;

    // Cache-first for same-origin assets, falling back to the cached shell offline.
    event.respondWith(
        caches.match(req).then((cached) => {
            if (cached) return cached;
            return fetch(req)
                .then((res) => {
                    const copy = res.clone();
                    caches.open(CACHE).then((cache) => cache.put(req, copy)).catch(() => {});
                    return res;
                })
                .catch(() => caches.match('index.html'));
        })
    );
});

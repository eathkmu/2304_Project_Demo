const CACHE_NAME = 'v1_site_cache';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icons/icon-192sq.png',
    '/icons/icon-512sq.png',
    '/icons/icon-512sq-maskable.png'

    // Add your CSS and JS files here
];

// 1. Install Event: Pre-caches the "App Shell"
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS_TO_CACHE))
            .then(() => self.skipWaiting()) // Forces the waiting SW to become active
    );
});

// 2. Activate Event: Cleans up old caches when the version updates
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// 3. Fetch Event: Serves cached content when offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cache hit, or fallback to network fetch
                return response || fetch(event.request);
            })
    );
});

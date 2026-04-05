const CACHE_NAME = 'freelink-v1.1.1';
const LOGO_CACHE = 'freelink-logos-v1';

const ASSETS = [
  './',
  './index.html',
  './site.webmanifest',
  './web-app-manifest-192x192.png',
  './web-app-manifest-512x512.png',
  './apple-touch-icon.png',
  './favicon-32x32.png',
  './club_data.json',
  'https://cdn.jsdelivr.net/npm/hls.js@1.0.0'
];

// 1. Installation
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// 2. Activation
self.addEventListener('activate', (e) => {
  const cacheWhitelist = [CACHE_NAME, LOGO_CACHE];
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (!cacheWhitelist.includes(key)) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 3. Récupération
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);

  // A. EXCLUSION : Flux vidéo et playlists (FORCER le réseau)
  if (
    url.pathname.match(/\.(ts|mp4|m3u8)$/i) || // Ajout de 'i' pour l'insensibilité à la casse
    url.hostname.includes('iptv-org') ||
    url.hostname.includes('iptv-ch') // Ajout de ta source suisse
  ) {
    // On ne fait rien d'autre que de laisser passer la requête vers internet
    return; 
  }

  // B. LOGOS : Cache-First
  if (e.request.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/i)) {
    e.respondWith(
      caches.open(LOGO_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(e.request);
        if (cachedResponse) return cachedResponse;

        try {
          const networkResponse = await fetch(e.request);
          // On cache si 200 (OK) ou 0 (Opaque/Cross-origin)
          if (networkResponse.status === 200 || networkResponse.status === 0) {
            cache.put(e.request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          // Image vide pour éviter les icônes cassées
          return new Response('', { status: 404 });
        }
      })
    );
    return;
  }

  // C. ASSETS : Network-First
  e.respondWith(
    fetch(e.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, cacheCopy));
        }
        return networkResponse;
      })
      .catch(() => caches.match(e.request))
  );
});
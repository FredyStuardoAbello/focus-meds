// =============================================
// FOCUS-MEDS — sw.js
// Service Worker: caché offline + notificaciones
// =============================================

const CACHE_NAME    = 'focusmeds-v1';
const CACHE_ASSETS  = [
  './',
  './index.html',
  './css/style.css',
  './js/storage.js',
  './js/notifications.js',
  './js/app.js',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

// --- INSTALL: cachear recursos estáticos ---
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// --- ACTIVATE: limpiar cachés anteriores ---
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// --- FETCH: responder desde caché, fallback a red ---
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
      .catch(() => caches.match('./index.html'))
  );
});

// --- NOTIFICATIONCLICK: acción al tocar la notificación ---
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        for (const client of clientList) {
          if (client.url.includes('index.html') && 'focus' in client) {
            return client.focus();
          }
        }
        return clients.openWindow('./index.html');
      })
  );
});
// =============================================
// FOCUS-MEDS — sw.js  (v3)
// =============================================
const CACHE_NAME   = 'focusmeds-v4';
const BASE         = '/focus-meds';
const CACHE_ASSETS = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/css/style.css',
  BASE + '/js/theme.js',
  BASE + '/js/onboarding.js',
  BASE + '/js/storage.js',
  BASE + '/js/notifications.js',
  BASE + '/js/app.js',
  BASE + '/manifest.json',
  BASE + '/icons/icon-72x72.png',
  BASE + '/icons/icon-192x192.png',
  BASE + '/icons/icon-512x512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(CACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(cached => cached || fetch(e.request))
      .catch(() => caches.match(BASE + '/index.html'))
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url.includes('index.html') && 'focus' in c) return c.focus();
      }
      return clients.openWindow(BASE + '/index.html');
    })
  );
});

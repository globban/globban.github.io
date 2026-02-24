self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

// This helps the browser keep the process alive
self.addEventListener('fetch', (e) => {
  e.respondWith(fetch(e.request));
});
// A minimal service worker to make the app installable
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installed');
  });
  
  self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activated');
  });
  
  self.addEventListener('fetch', (event) => {
    // Required event listener, even if it does nothing
  });
  
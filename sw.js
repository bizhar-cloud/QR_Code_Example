const CACHE_NAME = 'dama-v2'; // ناڤێ کاشێ هاتە گۆهۆڕین بۆ v2 دا کو گۆهۆڕینێن نوی ب کار بکەڤن
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json'
];

// دابەزاندنا فایلان د ناڤ مۆبایلێ دا (Install)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  // ڕاستەوخۆ ڤێرژنێ نوی بخە کار
  self.skipWaiting();
});

// ژێبرنا فایلێن کەڤن ئەگەر ڤێرژنەکێ نوی هات (Activate)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // کۆنترۆلا پەیچی ڕاستەوخۆ وەرگرە
  self.clients.claim();
});

// بکارئینانا فایلان ژ مۆبایلێ (Fetch) بەری ئینتەرنێتێ
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

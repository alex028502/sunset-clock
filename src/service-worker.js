'use strict';

const CACHE_PREFIX = 'sunset-clock-';
const CACHE_NAME = CACHE_PREFIX + 'BUILD_HASH';
const CACHED_URLS = [
  'index.html',
  'root.js',
  'sw-registration.js',
  // 'app.js.map', // seems that service worker caching doesn't work for source maps
  'manifest.json',
  'icons/48x48.png',
  'icons/96x96.png',
  'icons/192x192.png',
  'favicon.ico',
  'face.svg',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHED_URLS);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(caches.open(CACHE_NAME).then(function(cache) {
    // this page should not request anything that isn't
    // cached - and everything is cached when the service worker
    // is installed
    return cache.match(event.request).then(function(response) {
      if (response) {
        return response;
      }
      // if there is no match in the cache, just assume it is the project root
      return caches.match('index.html');
    });
  }));
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return CACHE_NAME !== cacheName && cacheName.startsWith(CACHE_PREFIX);
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

'use strict';

const CACHE_PREFIX = 'sunset-clock-';
const CACHE_NAME = CACHE_PREFIX + 'BUILD_HASH';
const CACHED_URLS = require('./lib/file-list.json');

self.addEventListener('install', function(event) {
  self.skipWaiting();
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
    return cache.match(withDefault(event.request), {
      ignoreSearch: true,
    }).then(function(response) {
      if (response) {
        return response;
      }
      return new Response(`no cached version of ${event.request.url} in ${CACHE_NAME}`, {
        headers: {'Content-Type': 'text/plain'},
      });
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

function withDefault(request) {
  if (request.url.endsWith('/')) {
    return new Request(request.url + 'main.html');
  } else if (request.url.endsWith('index.html')) {
    return new Request(request.url.replace('index.html', 'main.html'));
  }
  return request;
}

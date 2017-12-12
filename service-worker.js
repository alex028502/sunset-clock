/*!
 * service worker version 7eefff68133eeaff41f97f960b5aa25d
 *  not 856c67db569835307fed
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var CACHE_PREFIX = 'sunset-clock-';
var CACHE_NAME = CACHE_PREFIX + 'BUILD_HASH';
var CACHED_URLS = __webpack_require__(1);

self.addEventListener('install', function (event) {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
    return cache.addAll(CACHED_URLS);
  }));
});

self.addEventListener('fetch', function (event) {
  event.respondWith(caches.open(CACHE_NAME).then(function (cache) {
    // this page should not request anything that isn't
    // cached - and everything is cached when the service worker
    // is installed
    return cache.match(withDefault(event.request), {
      ignoreSearch: true
    }).then(function (response) {
      if (response) {
        return response;
      }
      return new Response('no cached version of ' + event.request.url + ' in ' + CACHE_NAME, {
        headers: { 'Content-Type': 'text/plain' }
      });
    });
  }));
});

self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (cacheNames) {
    return Promise.all(cacheNames.filter(function (cacheName) {
      return CACHE_NAME !== cacheName && cacheName.startsWith(CACHE_PREFIX);
    }).map(function (cacheName) {
      return caches.delete(cacheName);
    }));
  }));
});

function withDefault(request) {
  if (request.url.endsWith('/')) {
    return new Request(request.url + 'main.html');
  } else if (request.url.endsWith('index.html')) {
    return new Request(request.url.replace('index.html', 'main.html'));
  }
  return request;
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = ["main.html","root.js","sw-registration.js","manifest.json","48x48.png","96x96.png","192x192.png","favicon.ico","face.svg"]

/***/ })
/******/ ]);
//# sourceMappingURL=service-worker.js.map
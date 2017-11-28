'use strict';

if ('serviceWorker' in navigator && navigator.userAgent.indexOf('Electron') === -1) {
  navigator.serviceWorker.register('service-worker.js');
}

'use strict';

module.exports = function(fullText) {
  return fullText.match(/service worker version ([\w\-]*)/)[1];
};

/* eslint no-console: 0 */

'use strict';

require('raf/polyfill');
const assert = require('assert');

// thanks https://github.com/jesstelford/react-testing-mocha-jsdom
const jsdom = require('jsdom');
const dom = new jsdom.JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
global.document = dom.window.document;
global.window = dom.window;

global.testVars = {
  dom: dom,
};

global.navigator = {
  userAgent: 'node.js', //thanks http://stackoverflow.com/a/37084875/5203563
  geolocation: {
    getCurrentPosition: function(callback, error) {
      assert.ok(!global.testVars.locationCallback, 'clear vars before calling again');
      assert.ok(!global.testVars.locationErrorCallback, 'clear vars before calling again');
      global.testVars.locationCallback = callback;
      global.testVars.locationErrorCallback = error;
    },
  },
};

global.setInterval = function(callback, interval) {
  assert.ok(!global.testVars.timerInterval, 'clear vars before calling again');
  assert.ok(!global.testVars.timerCallback, 'clear vars before calling again');
  global.testVars.timerCallback = callback;
  global.testVars.timerInterval = interval;
};

global.localStorage = {
  getItem: function(key) {
    assert.equal(key, 'coordinates', 'unexpected local storage key');
    return global.testVars.storedCoordinates;
  },
  setItem: function(key, value) {
    assert.equal(key, 'coordinates', 'unexpected local storage key');
    global.testVars.storedCoordinates = value;
  },
};



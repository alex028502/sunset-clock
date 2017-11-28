/* eslint no-console: 0 */

'use strict';

const assert = require('assert');

const testVars = {};

const geolocation = {
  getCurrentPosition: function(callback, error) {
    assert.ok(!testVars.locationCallback, 'clear vars before calling again');
    assert.ok(!testVars.locationErrorCallback, 'clear vars before calling again');
    testVars.locationCallback = callback;
    testVars.locationErrorCallback = error;
  },
};

const setInterval = function(callback, interval) {
  assert.ok(!testVars.timerInterval, 'clear vars before calling again');
  assert.ok(!testVars.timerCallback, 'clear vars before calling again');
  testVars.timerCallback = callback;
  testVars.timerInterval = interval;
};

const localStorage = {
  getItem: function(key) {
    assert.equal(key, 'coordinates', 'unexpected local storage key');
    return testVars.storedCoordinates;
  },
  setItem: function(key, value) {
    assert.equal(key, 'coordinates', 'unexpected local storage key');
    testVars.storedCoordinates = value;
  },
};

module.exports = {
  testVars: testVars,
  props: {
    geolocation: geolocation,
    localStorage: localStorage,
    setInterval: setInterval,
  },
};

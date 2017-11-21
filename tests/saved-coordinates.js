'use strict';

const expect = require('chai').expect;

require('./helpers/integration-setup');

const INITIAL_ERROR_MESSAGE = 'initial error message from local storage';
const YESTERDAY = new Date((new Date()).getTime() - 2 * 12 * 60 * 60 * 1000);

const EXPECTED_COORDINATE_STRING = '44°0′0″N 55°0′0″E';
const LATITUDE = 44;
const LONGITUDE = 55;

expect(EXPECTED_COORDINATE_STRING).to.include(LATITUDE);
expect(EXPECTED_COORDINATE_STRING).to.include(LONGITUDE);

global.testVars.storedCoordinates = JSON.stringify({
  latitude: LATITUDE,
  longitude: LONGITUDE,
  error: INITIAL_ERROR_MESSAGE,
  timestamp: YESTERDAY,
});

require('../src/app');
const dom = global.testVars.dom;

expect(global.testVars.timerCallback).to.be.a('function');
expect(global.testVars.timerInterval).to.equal(10000);
expect(global.testVars.storedCoordinates).to.be.ok;

expect(dom.serialize(document)).to.include('face.svg');
expect(dom.serialize(document)).to.include(EXPECTED_COORDINATE_STRING);
expect(dom.serialize(document)).to.include(INITIAL_ERROR_MESSAGE);
expect(dom.serialize(document)).to.include('yesterday');
expect(dom.serialize(document)).not.to.include('Greenwich');

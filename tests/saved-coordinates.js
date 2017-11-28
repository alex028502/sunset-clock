'use strict';

const expect = require('chai').expect;

require('./helpers/integration-setup');

const EXPECTED_COORDINATE_STRING = '44°0′0″N 55°0′0″E';
const LATITUDE = 44;
const LONGITUDE = 55;

expect(EXPECTED_COORDINATE_STRING).to.include(LATITUDE);
expect(EXPECTED_COORDINATE_STRING).to.include(LONGITUDE);

global.testVars.storedCoordinates = JSON.stringify({
  latitude: LATITUDE,
  longitude: LONGITUDE,
});

require('../src/app');
const dom = global.testVars.dom;

expect(global.testVars.timerCallback).to.be.a('function');
expect(global.testVars.timerInterval).to.equal(10000);
expect(global.testVars.storedCoordinates).to.be.ok;

expect(dom.serialize(document)).to.include('face.svg');
expect(dom.serialize(document)).to.include(EXPECTED_COORDINATE_STRING);

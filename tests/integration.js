'use strict';

const EXPECTED_DEFAULT_POSITION = '51°47′60″N 0°0′0″W';
const expect = require('chai').expect;

require('./helpers/integration-setup');
const findOnClickMethodOfElement = require('./helpers/find-on-click');

require('../src/app');
const dom = global.testVars.dom;

expect(global.testVars.timerCallback).to.be.a('function');
expect(global.testVars.timerInterval).to.equal(10000);
expect(global.testVars.storedCoordinates).not.to.be.ok;

// THE BAD NEWS IS THAT JSDOM DOESN'T SEEM TO SUPPORT
// CSS3 PROPERTIES SO WE CAN CHECK THAT ALL THE PIECES
// WORK TOGETHER BUT WE CAN'T CHECK THAT THE ANGLE IS CORRECT
// WITH THIS STRATEGY

expect(dom.serialize(document)).to.include('face.svg');
expect(dom.serialize(document)).to.include(EXPECTED_DEFAULT_POSITION);
expect(dom.serialize(document)).to.include('Greenwich');

global.testVars.timerCallback();

expect(global.testVars.storedCoordinates).to.be.ok; // for now it saves the location on every iteration
expect(global.testVars.storedCoordinates).to.include('Greenwich');
expect(dom.serialize(document)).to.include('face.svg');
expect(dom.serialize(document)).to.include(EXPECTED_DEFAULT_POSITION);
expect(dom.serialize(document)).to.include('Greenwich');

expect(global.testVars.locationCallback).not.to.be.ok;
expect(global.testVars.locationErrorCallback).not.to.be.ok;

const button = dom.window.document.querySelector('button');

expect(global.testVars.locationCallback).not.to.be.ok;
expect(global.testVars.locationErrorCallback).not.to.be.ok;

findOnClickMethodOfElement(button)();

expect(global.testVars.locationCallback).to.be.ok;
expect(global.testVars.locationErrorCallback).to.be.ok;

const LOCATION_ERROR_MESSAGE = 'THIS IS A TEST ERROR';

global.testVars.locationErrorCallback({
  message: LOCATION_ERROR_MESSAGE,
});

expect(dom.serialize(document)).to.include('face.svg');
expect(dom.serialize(document)).to.include(EXPECTED_DEFAULT_POSITION);
expect(dom.serialize(document)).to.include(LOCATION_ERROR_MESSAGE);
expect(dom.serialize(document)).not.to.include('Greenwich');

global.testVars.locationCallback = null;
global.testVars.locationErrorCallback = null;

findOnClickMethodOfElement(button)();

expect(global.testVars.locationCallback).to.be.ok;
expect(global.testVars.locationErrorCallback).to.be.ok;

global.testVars.locationCallback({
  coords: {
    longitude: 55,
    latitude: 55,
  },
});

expect(dom.serialize(document)).to.include('face.svg');
expect(dom.serialize(document)).not.to.include(EXPECTED_DEFAULT_POSITION);
expect(dom.serialize(document)).not.to.include(LOCATION_ERROR_MESSAGE);
expect(dom.serialize(document)).not.to.include('Greenwich');
expect(dom.serialize(document)).to.include('updated');
expect(dom.serialize(document)).to.include('55°0′0″N 55°0′0″');


expect(JSON.parse(global.testVars.storedCoordinates)).to.have.property('latitude', 55);
expect(JSON.parse(global.testVars.storedCoordinates)).to.have.property('timestamp');
expect(JSON.parse(global.testVars.storedCoordinates)).to.have.property('longitude', 55);

global.testVars.timerCallback();

expect(dom.serialize(document)).to.include('face.svg');
expect(dom.serialize(document)).not.to.include(EXPECTED_DEFAULT_POSITION);
expect(dom.serialize(document)).not.to.include(LOCATION_ERROR_MESSAGE);
expect(dom.serialize(document)).not.to.include('Greenwich');
expect(dom.serialize(document)).to.include('updated');
expect(dom.serialize(document)).to.include('55°0′0″N 55°0′0″');

process.exit(0);

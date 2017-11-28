'use strict';

const EXPECTED_DEFAULT_POSITION = '51°47′60″N 0°0′0″W';
const expect = require('chai').expect;

require('./helpers/integration-global');
const findOnClickMethodOfElement = require('./helpers/find-on-click');

require('../src/root');
const dom = global.testVars.dom;

expect(global.testVars.timerCallback).to.be.a('function');
expect(global.testVars.timerInterval).to.equal(10000);
expect(global.testVars.storedCoordinates).not.to.be.ok;

expect(dom.serialize(document)).to.include('face.svg');
expect(dom.serialize(document)).to.include(EXPECTED_DEFAULT_POSITION);
expect(dom.serialize(document)).to.include('Greenwich');

const initialPosition = currentPosition(dom);

global.testVars.timerCallback();

expect(global.testVars.storedCoordinates).not.to.be.ok;
expect(dom.serialize(document)).to.include('face.svg');
expect(dom.serialize(document)).to.include(EXPECTED_DEFAULT_POSITION);
expect(dom.serialize(document)).to.include('Greenwich');


const positionAfterFirstTick = currentPosition(dom);

expect(positionAfterFirstTick).to.be.above(initialPosition);

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

expect(currentPosition(dom)).to.equal(positionAfterFirstTick);

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
expect(JSON.parse(global.testVars.storedCoordinates)).not.to.have.property('timestamp');
expect(JSON.parse(global.testVars.storedCoordinates)).to.have.property('longitude', 55);

const positionAfterChangingLocation = currentPosition(dom);
expect(positionAfterChangingLocation).not.to.equal(positionAfterFirstTick);

global.testVars.timerCallback();

expect(dom.serialize(document)).to.include('face.svg');
expect(dom.serialize(document)).not.to.include(EXPECTED_DEFAULT_POSITION);
expect(dom.serialize(document)).not.to.include(LOCATION_ERROR_MESSAGE);
expect(dom.serialize(document)).not.to.include('Greenwich');
expect(dom.serialize(document)).to.include('updated');
expect(dom.serialize(document)).to.include('55°0′0″N 55°0′0″');

const positionAfterNextTick = currentPosition(dom);
expect(positionAfterNextTick).to.be.above(positionAfterChangingLocation);

global.testVars.timerCallback();

// the needle position is so accurate that even with the tiny time changes
// it still moves when we tell it to update

const positionAfterLastTick = currentPosition(dom);
expect(positionAfterLastTick).to.be.above(positionAfterNextTick);

process.exit(0);

function currentPosition(dom) {
  // probably won't work when there is more than one image in the component
  const START = 'rotate(';
  const END = 'deg)';
  const style = dom.window.document.querySelector('img').style.transform;
  expect(style).to.include(START);
  expect(style).to.include(END);
  return parseFloat(style.replace(START, '').replace(END, ''), 10);
}

'use strict';

'use strict';

require('raf/polyfill');

const integerationHelper = require('./helpers/integration-helper');

// thanks https://github.com/jesstelford/react-testing-mocha-jsdom
const jsdom = require('jsdom');
const dom = new jsdom.JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
global.document = dom.window.document;
global.window = dom.window;

global.navigator = {
  userAgent: 'node.js', //thanks http://stackoverflow.com/a/37084875/5203563
  geolocation: integerationHelper.props.geolocation,
};

global.setInterval = integerationHelper.props.setInterval;

global.localStorage = integerationHelper.props.localStorage;

global.testVars = integerationHelper.testVars;
global.testVars.dom = dom;

const EXPECTED_DEFAULT_POSITION = '51°47′60″N 0°0′0″W';
const expect = require('chai').expect;

function findOnClickMethodOfElement(element) {
  // trial and error
  // looking for something like __reactEventHandlers$st5eih1w5dnuubr8uo50cnmi
  const eventHandlerKey = Object.keys(element).filter((name) => name.indexOf('reactEventHandlers') !== -1)[0];
  return element[eventHandlerKey].onClick;
}

require('../src/root');

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

global.testVars.locationCallback({
  coords: {
    longitude: 55,
    latitude: 55,
  },
});

expect(dom.serialize(document)).to.include('face.svg');
expect(dom.serialize(document)).not.to.include(EXPECTED_DEFAULT_POSITION);
expect(dom.serialize(document)).not.to.include('Greenwich');
expect(dom.serialize(document)).not.to.include('updated'); // TODO: remove eventually
expect(dom.serialize(document)).to.include('55°0′0″N 55°0′0″');


expect(JSON.parse(global.testVars.storedCoordinates)).to.have.property('latitude', 55);
expect(JSON.parse(global.testVars.storedCoordinates)).not.to.have.property('timestamp');
expect(JSON.parse(global.testVars.storedCoordinates)).to.have.property('longitude', 55);

expect(currentPosition(dom)).not.to.equal(positionAfterFirstTick);

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

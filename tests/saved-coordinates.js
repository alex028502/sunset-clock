'use strict';

const React = require('react');

const expect = require('chai').expect;
const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
Enzyme.configure({ adapter: new Adapter() });

const mount = require('enzyme').mount;

// for now let's use the same set-up and just pass in the global variables
// some of it will be redundant (like the dom)
require('./helpers/integration-setup');

const Sut = require('../src/clock-app');

const EXPECTED_COORDINATE_STRING = '44°0′0″N 55°0′0″E';
const LATITUDE = 44;
const LONGITUDE = 55;

expect(EXPECTED_COORDINATE_STRING).to.include(LATITUDE);
expect(EXPECTED_COORDINATE_STRING).to.include(LONGITUDE);

global.testVars.storedCoordinates = JSON.stringify({
  latitude: LATITUDE,
  longitude: LONGITUDE,
});

const wrapper = mount(<Sut
  geolocation={navigator.geolocation}
  localStorage={localStorage}
  setInterval={setInterval}
/>);

expect(global.testVars.timerCallback).to.be.a('function');
expect(global.testVars.timerInterval).to.equal(10000);
expect(global.testVars.storedCoordinates).to.be.ok;

expect(wrapper.html()).to.include('face.svg');
expect(wrapper.html()).to.include(EXPECTED_COORDINATE_STRING);

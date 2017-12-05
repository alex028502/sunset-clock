'use strict';

require('../helpers/unhandled-rejection');

const React = require('react');

const EXPECTED_DEFAULT_POSITION = '51°47′60″N 0°0′0″W';
const expect = require('chai').expect;

const integrationHelper = require('../helpers/integration-helper');
require('../helpers/enzyme-setup');

const mount = require('enzyme').mount;

const Sut = require('../../src/clock-app');

const wrapper = mount(<Sut {...integrationHelper.props} />);

expect(integrationHelper.testVars.timerCallback).to.be.a('function');
expect(integrationHelper.testVars.timerInterval).to.equal(10000);
expect(integrationHelper.testVars.storedCoordinates).not.to.be.ok;

expect(wrapper.html()).to.include('face.svg');
expect(wrapper.html()).to.include(EXPECTED_DEFAULT_POSITION);
expect(wrapper.html()).to.include('Greenwich');

const initialPosition = currentPosition(wrapper);

integrationHelper.testVars.timerCallback();
wrapper.update();

expect(integrationHelper.testVars.storedCoordinates).not.to.be.ok;
expect(wrapper.html()).to.include('face.svg');
expect(wrapper.html()).to.include(EXPECTED_DEFAULT_POSITION);
expect(wrapper.html()).to.include('Greenwich');


const positionAfterFirstTick = currentPosition(wrapper);

expect(positionAfterFirstTick).to.be.above(initialPosition);

expect(integrationHelper.testVars.locationCallback).not.to.be.ok;
expect(integrationHelper.testVars.locationErrorCallback).not.to.be.ok;

expect(integrationHelper.testVars.locationCallback).not.to.be.ok;
expect(integrationHelper.testVars.locationErrorCallback).not.to.be.ok;

wrapper.find('button').simulate('click');
wrapper.update();

expect(integrationHelper.testVars.locationCallback).to.be.ok;
expect(integrationHelper.testVars.locationErrorCallback).to.be.ok;

const LOCATION_ERROR_MESSAGE = 'THIS IS A TEST ERROR';

integrationHelper.testVars.locationErrorCallback({
  message: LOCATION_ERROR_MESSAGE,
});

expect(wrapper.html()).to.include('face.svg');
expect(wrapper.html()).to.include(EXPECTED_DEFAULT_POSITION);
expect(wrapper.html()).to.include(LOCATION_ERROR_MESSAGE);
expect(wrapper.html()).not.to.include('Greenwich');

integrationHelper.testVars.locationCallback = null;
integrationHelper.testVars.locationErrorCallback = null;

expect(currentPosition(wrapper)).to.equal(positionAfterFirstTick);

wrapper.find('button').simulate('click');
wrapper.update();

expect(integrationHelper.testVars.locationCallback).to.be.ok;
expect(integrationHelper.testVars.locationErrorCallback).to.be.ok;

integrationHelper.testVars.locationCallback({
  coords: {
    longitude: 55,
    latitude: 55,
  },
});
wrapper.update();

expect(wrapper.html()).to.include('face.svg');
expect(wrapper.html()).not.to.include(EXPECTED_DEFAULT_POSITION);
expect(wrapper.html()).not.to.include(LOCATION_ERROR_MESSAGE);
expect(wrapper.html()).not.to.include('Greenwich');
expect(wrapper.html()).not.to.include('updated'); // TODO: remove once we forget all about updated
expect(wrapper.html()).to.include('55°0′0″N 55°0′0″');


expect(JSON.parse(integrationHelper.testVars.storedCoordinates)).to.have.property('latitude', 55);
expect(JSON.parse(integrationHelper.testVars.storedCoordinates)).not.to.have.property('timestamp');
expect(JSON.parse(integrationHelper.testVars.storedCoordinates)).to.have.property('longitude', 55);

const positionAfterChangingLocation = currentPosition(wrapper);
expect(positionAfterChangingLocation).not.to.equal(positionAfterFirstTick);

integrationHelper.testVars.timerCallback();
wrapper.update();

expect(wrapper.html()).to.include('face.svg');
expect(wrapper.html()).not.to.include(EXPECTED_DEFAULT_POSITION);
expect(wrapper.html()).not.to.include(LOCATION_ERROR_MESSAGE);
expect(wrapper.html()).not.to.include('Greenwich');
expect(wrapper.html()).not.to.include('updated'); // TODO: remove
expect(wrapper.html()).to.include('55°0′0″N 55°0′0″');

const positionAfterNextTick = currentPosition(wrapper);
expect(positionAfterNextTick).to.be.above(positionAfterChangingLocation);

integrationHelper.testVars.timerCallback();
wrapper.update();

// the needle position is so accurate that even with the tiny time changes
// it still moves when we tell it to update

const positionAfterLastTick = currentPosition(wrapper);
expect(positionAfterLastTick).to.be.above(positionAfterNextTick);

function currentPosition(wrapper) {
  // probably won't work when there is more than one image in the component
  const START = 'rotate(';
  const END = 'deg)';
  const style = wrapper.find('img').props().style.transform;
  expect(style).to.include(START);
  expect(style).to.include(END);
  return parseFloat(style.replace(START, '').replace(END, ''), 10);
}

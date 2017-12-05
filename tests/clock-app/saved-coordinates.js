'use strict';

require('../helpers/unhandled-rejection');

const React = require('react');

const expect = require('chai').expect;

require('../helpers/enzyme-setup');

const mount = require('enzyme').mount;

const integrationHelper = require('../helpers/integration-helper');

const Sut = require('../../src/clock-app');

const EXPECTED_COORDINATE_STRING = '44°0′0″N 55°0′0″E';
const LATITUDE = 44;
const LONGITUDE = 55;

expect(EXPECTED_COORDINATE_STRING).to.include(LATITUDE);
expect(EXPECTED_COORDINATE_STRING).to.include(LONGITUDE);

integrationHelper.testVars.storedCoordinates = JSON.stringify({
  latitude: LATITUDE,
  longitude: LONGITUDE,
});

const wrapper = mount(<Sut {...integrationHelper.props} />);

expect(integrationHelper.testVars.timerCallback).to.be.a('function');
expect(integrationHelper.testVars.timerInterval).to.equal(10000);
expect(integrationHelper.testVars.storedCoordinates).to.be.ok;

expect(wrapper.html()).to.include('face.svg');
expect(wrapper.html()).to.include(EXPECTED_COORDINATE_STRING);

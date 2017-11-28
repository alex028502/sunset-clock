'use strict';

// sometimes access to local storage is forbidden
// so make sure that the user knows why nothing works

const React = require('react');

const expect = require('chai').expect;

const integrationHelper = require('./helpers/integration-helper');

require('./helpers/enzyme-setup');

const mount = require('enzyme').mount;

const NO_WRITE_MESSAGE = 'access denied for writing';
const NO_READ_MESSAGE = 'access denied for reading';

const localStorage = {
  setItem: function(key) {
    throw new Error(NO_WRITE_MESSAGE);
  },
  getItem: function(key, value) {
    throw new Error(NO_READ_MESSAGE);
  },
};

const Sut = require('../src/clock-app');

const wrapper = mount(<Sut
  localStorage={localStorage}
  geolocation={integrationHelper.props.geolocation}
  setInterval={integrationHelper.props.setInterval}
/>);

expect(integrationHelper.testVars.timerCallback).to.be.a('function');
expect(integrationHelper.testVars.timerInterval).to.equal(10000);
expect(integrationHelper.testVars.storedCoordinates).not.to.be.ok;

// should fail silently when it tries to write
// since it already got a messsage when it tried to read initially

expect(wrapper.html()).to.include('face.svg');
expect(wrapper.html()).not.to.include('Greenwich');
expect(wrapper.html()).to.include('cannot read');

integrationHelper.testVars.timerCallback(); // should fail silently

expect(wrapper.html()).to.include('face.svg');
expect(wrapper.html()).not.to.include('Greenwich');
expect(wrapper.html()).to.include(NO_READ_MESSAGE);
expect(wrapper.html()).not.to.include(NO_WRITE_MESSAGE);

wrapper.find('button').simulate('click');

expect(integrationHelper.testVars.locationCallback).to.be.ok;
expect(integrationHelper.testVars.locationErrorCallback).to.be.ok;

integrationHelper.testVars.locationCallback({
  coords: {
    longitude: 55,
    latitude: 55,
  },
});

expect(wrapper.html()).to.include('face.svg');
expect(wrapper.html()).not.to.include('Greenwich');

// nothing is saved but there is no message anymore
expect(wrapper.html()).not.to.include('cannot read');
expect(wrapper.html()).not.to.include(NO_READ_MESSAGE);
expect(wrapper.html()).not.to.include(NO_WRITE_MESSAGE);
expect(wrapper.html()).to.include('55');

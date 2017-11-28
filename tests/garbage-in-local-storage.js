'use strict';

// sometimes access to local storage is forbidden
// so make sure that the user knows why nothing works

const React = require('react');

const expect = require('chai').expect;

require('./helpers/enzyme-setup');
const integrationHelper = require('./helpers/integration-helper');
const mount = require('enzyme').mount;

integrationHelper.testVars.storedCoordinates = 'THIS IS NOT JSON';

const Sut = require('../src/clock-app');

const wrapper = mount(<Sut {...integrationHelper.props} />);

expect(integrationHelper.testVars.timerCallback).to.be.a('function');
expect(integrationHelper.testVars.timerInterval).to.equal(10000);
expect(integrationHelper.testVars.storedCoordinates).to.be.ok;

expect(wrapper.html()).to.include('face.svg');
expect(wrapper.html()).not.to.include('Greenwich');

// doesn't know that it's just a json problem - assumes it can't read
expect(wrapper.html()).to.include('cannot read');

// should still be able to save new coordinates

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
expect(wrapper.html()).to.include('55');
expect(wrapper.html()).not.to.include('updated'); // TODO: remove
expect(wrapper.html()).not.to.include('Greenwich');
expect(wrapper.html()).not.to.include('cannot read');

// everything should be saved in local storage
expect(integrationHelper.testVars.storedCoordinates).to.be.ok;
expect(JSON.stringify(integrationHelper.testVars.storedCoordinates)).to.include('55');

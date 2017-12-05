'use strict';

// in electron there should be no button for automatically updating
// your location since it doesn't work

require('../helpers/unhandled-rejection');

const React = require('react');

const expect = require('chai').expect;

require('../helpers/enzyme-setup');
const integrationHelper = require('../helpers/integration-helper');
const mount = require('enzyme').mount;

const Sut = require('../../src/clock-app');

const props = Object.assign({}, integrationHelper.props, {
  userAgent: 'NODE.JS Electron', // as long as it says Electron somewhere it should work
});

const NEW_COORDINATES = '22°18′0″N 114°12′0″E';

const wrapper = mount(<Sut {...props} />);

expect(integrationHelper.testVars.window.onpopstate).to.be.a('function');

expect(integrationHelper.testVars.timerCallback).to.be.a('function');
expect(integrationHelper.testVars.timerInterval).to.equal(10000);
expect(integrationHelper.testVars.storedCoordinates).not.to.be.ok;

expect(wrapper.html()).to.include('face.svg');
expect(wrapper.html()).not.to.include('Greenwich');
expect(wrapper.html()).not.to.include(NEW_COORDINATES);
expect(wrapper.html()).to.include('Choose Set Coordinates');
expect(wrapper.html()).to.include('51');
expect(wrapper.html()).not.to.include('button');

integrationHelper.testVars.document.location.hash = '#set-coordinates';
integrationHelper.testVars.window.onpopstate();
wrapper.update();

expect(wrapper.html()).not.to.include('face.svg');
expect(wrapper.html()).to.include('To change it, use the form below');
expect(wrapper.html()).to.include('input');
expect(wrapper.html()).to.include('disabled');

wrapper.find('input').simulate('change', { target: { value: NEW_COORDINATES } });
wrapper.update();

expect(wrapper.html()).not.to.include('disabled');
expect(wrapper.html()).to.include(NEW_COORDINATES);
expect(wrapper.html()).to.include('51');

expect(wrapper.find('button').html()).to.include('submit');
wrapper.find('form').simulate('submit');
wrapper.update();

expect(wrapper.html()).to.include(NEW_COORDINATES);
expect(wrapper.find('p').html()).not.to.include('51');

expect(wrapper.find('a').html()).to.include('href="#"');
integrationHelper.testVars.document.location.hash = '#';
integrationHelper.testVars.window.onpopstate();
wrapper.update();

expect(wrapper.html()).to.include(NEW_COORDINATES);
expect(wrapper.html()).not.to.include('51');
expect(wrapper.html()).to.include('face.svg');

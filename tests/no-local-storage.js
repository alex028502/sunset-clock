'use strict';

// sometimes access to local storage is forbidden
// so make sure that the user knows why nothing works

const expect = require('chai').expect;

require('./helpers/integration-setup');
const findOnClickMethodOfElement = require('./helpers/find-on-click');

const NO_WRITE_MESSAGE = 'access denied for writing';
const NO_READ_MESSAGE = 'access denied for reading';

global.localStorage = {
  setItem: function(key) {
    throw new Error(NO_WRITE_MESSAGE);
  },
  getItem: function(key, value) {
    throw new Error(NO_READ_MESSAGE);
  },
};

require('../src/app');
const dom = global.testVars.dom;

expect(global.testVars.timerCallback).to.be.a('function');
expect(global.testVars.timerInterval).to.equal(10000);
expect(global.testVars.storedCoordinates).not.to.be.ok;

// should fail silently when it tries to write
// since it already got a messsage when it tried to read initially

expect(dom.serialize(document)).to.include('face.svg');
expect(dom.serialize(document)).not.to.include('Greenwich');
expect(dom.serialize(document)).to.include('cannot read');

global.testVars.timerCallback(); // should fail silently

expect(dom.serialize(document)).to.include('face.svg');
expect(dom.serialize(document)).not.to.include('Greenwich');
expect(dom.serialize(document)).to.include(NO_READ_MESSAGE);
expect(dom.serialize(document)).not.to.include(NO_WRITE_MESSAGE);

const button = dom.window.document.querySelector('button');
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
expect(dom.serialize(document)).not.to.include('Greenwich');

// nothing is saved but there is no message anymore
expect(dom.serialize(document)).not.to.include('cannot read');
expect(dom.serialize(document)).not.to.include(NO_READ_MESSAGE);
expect(dom.serialize(document)).not.to.include(NO_WRITE_MESSAGE);
expect(dom.serialize(document)).to.include('55');

process.exit(0);

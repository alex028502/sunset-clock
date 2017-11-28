'use strict';

// sometimes access to local storage is forbidden
// so make sure that the user knows why nothing works

const expect = require('chai').expect;

require('./helpers/integration-global');
const findOnClickMethodOfElement = require('./helpers/find-on-click');

global.testVars.storedCoordinates = 'THIS IS NOT JSON';

require('../src/root');
const dom = global.testVars.dom;

expect(global.testVars.timerCallback).to.be.a('function');
expect(global.testVars.timerInterval).to.equal(10000);
expect(global.testVars.storedCoordinates).to.be.ok;

expect(dom.serialize(document)).to.include('face.svg');
expect(dom.serialize(document)).not.to.include('Greenwich');

// doesn't know that it's just a json problem - assumes it can't read
expect(dom.serialize(document)).to.include('cannot read');

// should still be able to save new coordinates

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
expect(dom.serialize(document)).to.include('55');
expect(dom.serialize(document)).to.include('updated');
expect(dom.serialize(document)).not.to.include('Greenwich');
expect(dom.serialize(document)).not.to.include('cannot read');

// everything should be saved in local storage
expect(global.testVars.storedCoordinates).to.be.ok;
expect(JSON.stringify(global.testVars.storedCoordinates)).to.include('55');

process.exit(0);

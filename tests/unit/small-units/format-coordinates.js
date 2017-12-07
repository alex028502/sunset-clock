'use strict';

const expect = require('chai').expect;

const sut = require('../../../src/lib/format-coordinates');

expect(sut({
  latitude: 33 + 33 / 60 + 33.3 / 60 / 60,
  longitude: 3 + 37 / 60 / 60,
})).to.equal('33°33′33″N 3°0′37″E');


// this is the hard one that the formatcoords library
// doesn't solve for us
expect(sut({
  latitude: 33 + 33 / 60 + 59.9 / 60 / 60,
  longitude: 3 + 59 / 60 +  59.9 / 60 / 60,
})).to.equal('33°34′0″N 4°0′0″E');

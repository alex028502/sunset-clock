'use strict';

const expect = require('chai').expect;

const sut = require('../src/lib/format-coordinates');

expect(sut({
  latitude: 33 + 33 / 60 + 33.3 / 60 / 60,
  longitude: 3 + 37 / 60 / 60,
})).to.equal('33°33′33″N 3°0′37″E');


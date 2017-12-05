'use strict';

const expect = require('chai').expect;

const sut = require('./extract-angle');

const expectedAnswer = '200.345478';

const html = `
something on the first line
transform: rotate(${expectedAnswer}deg);
something on the last line
`;

expect(sut(html)).to.equal(expectedAnswer);

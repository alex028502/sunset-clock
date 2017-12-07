'use strict';

const expect = require('chai').expect;

const sut = require('./skip-for-other-browsers');

let counter = 0;

function increment() {
  return ++counter;
}

expect(increment()).to.equal(1);
expect(counter).to.equal(1);
expect(sut(increment)).to.equal(2);
expect(counter).to.equal(2);

process.env.SELENIUM_BROWSER = 'test';

expect(sut(increment)).not.to.be.ok;
expect(counter).to.equal(2);

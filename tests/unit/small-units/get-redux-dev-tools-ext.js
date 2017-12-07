'use strict';

const expect = require('chai').expect;

const __REDUX_DEVTOOLS_EXTENSION__ = {
  fake: 'extension',
};

const fakeWindow = {
  __REDUX_DEVTOOLS_EXTENSION__: function() {
    return __REDUX_DEVTOOLS_EXTENSION__;
  },
};

const sut = require('../../../src/lib/get-redux-dev-tools-ext');

expect(sut(fakeWindow)).to.equal(__REDUX_DEVTOOLS_EXTENSION__);

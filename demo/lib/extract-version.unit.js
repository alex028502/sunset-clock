'use strict';

const sut = require('./extract-version');
const expect = require('chai').expect;


const testHash = 'b9c52bb1-ec08-495f-921d-219ab00e305a';

expect(sut(`hello - service worker version ${testHash} - see if you can extract it`)).to.equal(testHash);

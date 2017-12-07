'use strict';

const expect = require('chai').expect;

const sut = require('../../../src/lib/file-list.json');

// subdirectories don't seem to work as expected
// on github pages
expect(JSON.stringify(sut)).not.to.include('/');


// this test is really here for documentation since you can't add comments
// in json.  When I tried it looked like js.map files didn't get cached
// TODO: try again soon
expect(JSON.stringify(sut)).not.to.include('js.map');

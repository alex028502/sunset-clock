'use strict';

const expect = require('chai').expect;

require('../../lib/unhandled-rejection');

const fs = require('fs');

const TEST_FILE_PATH = __dirname + '/../lib.js';

const syncVersion = `${fs.readFileSync(TEST_FILE_PATH)}`;

const sut = require('./read-stream');

(async function() {
  const stream = fs.createReadStream(TEST_FILE_PATH);
  const streamVersion = await sut(stream);
  expect(streamVersion).to.equal(syncVersion);
})();

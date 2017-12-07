'use strict';

/* eslint no-console: 0 */

const PORT = 8080;

const REPLACEMENT_HASH = process.argv[3];
const PUBLIC_DIRECTORY = process.argv[2];

if (REPLACEMENT_HASH) {
  console.log(`starting but changing version number to ${REPLACEMENT_HASH}`);
}

require('./lib')(PUBLIC_DIRECTORY, 8080, REPLACEMENT_HASH).then(function() {
  console.log(`serving ${PUBLIC_DIRECTORY} on port ${PORT}`);
});

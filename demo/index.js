'use strict';

/* eslint no-console: 0 */

const PORT = 8080;

if (process.argv[2]) {
  console.log(`starting but changing version number to ${process.argv[2]}`);
}

require('./lib')(8080, process.argv[2]).then(function() {
  console.log(`server running on port ${PORT}`);
});

'use strict';

const toString = require('stream-to-string');

module.exports = readStream;

function readStream(stream) {
  // TODO: inline
  return toString(stream);
}

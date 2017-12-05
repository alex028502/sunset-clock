'use strict';

module.exports = readStream;

function readStream(stream) {
  // TODO: is this really the easiest way to read a stream?
  return new Promise(function(resolve) {
    let string = '';
    // thanks https://stackoverflow.com/a/35530615/5203563
    stream.on('data', function(chunk) {
      string += chunk;
    });

    // Send the buffer or you can put it into a var
    stream.on('end', function() {
      resolve(string);
    });
  });
}

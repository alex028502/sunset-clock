'use strict';

process.on('unhandledRejection', function(up) {
  // thanks https://medium.com/@dtinth/making-unhandled-promise-rejections-crash-the-node-js-process-ffc27cfcc9dd
  throw up;
});

'use strict';

module.exports = function(command) {
  if (!process.env.SELENIUM_BROWSER) {
    return command();
  }
  return undefined;
};

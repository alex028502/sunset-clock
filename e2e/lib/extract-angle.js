'use strict';

module.exports = function(html) {
  return html.match(/rotate\(([0-9\.]*)deg\)/)[1];
};

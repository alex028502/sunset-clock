'use strict';

const formatcoords = require('formatcoords');

module.exports = formatCoordinates;

function formatCoordinates(coordinates) {
  return formatcoords(coordinates.latitude, coordinates.longitude).format('DDMMssX', {decimalPlaces: 0});
}

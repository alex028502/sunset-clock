'use strict';

const formatcoords = require('formatcoords');

module.exports = formatCoordinates;

function formatCoordinates(coordinates) {
  return formatcoords(
    roundOffToNearestSecond(coordinates.latitude),
    roundOffToNearestSecond(coordinates.longitude)
  ).format('DDMMssX', {decimalPlaces: 0});
}

function roundOffToNearestSecond(numberOfDegrees) {
  return Math.round(3600 * numberOfDegrees) / 3600;
}

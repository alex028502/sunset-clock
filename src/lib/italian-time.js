'use strict';

const SunCalc = require('suncalc');

// start with sunset yesterday
// and then add a day until we find a sunset in the future
// in order to avoid time zone issues

module.exports = function(now, coordinates) {

  const day_per_millisecond = 1000 * 60 * 60 * 24;

  for (let t = now.getTime() - 1 * day_per_millisecond; true; t += day_per_millisecond) {
    const sunset = SunCalc.getTimes(
      new Date(t),
      coordinates.latitude,
      coordinates.longitude
    ).sunset;

    const dayEnd = new Date(sunset.getTime() + 30 * 60 * 1000);

    if (dayEnd > now) {
      return noLessThan0(1 + (now - dayEnd) / day_per_millisecond);
    }
  }
};

function noLessThan0(number) {
  if (number < 0) {return 0;}
  return number;
}

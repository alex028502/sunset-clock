'use strict';

// when the italians used this system according to what I can find
// on wikipedia, they ended the day a half hour after sunset
// which is right before the end of civil twilight
// while they used the previous sunset as a reference
// we can use the next sunset as a reference to get a more
// accurate count down to sunset
// https://en.wikipedia.org/wiki/Hour#Counting_from_sunset
// https://en.wikipedia.org/wiki/Prague_astronomical_clock

const proxyquire = require('proxyquire');
const expect = require('chai').expect;

//this is not the real sunset for these coordinates on this day
const COORDINATES = {latitude: 25.00, longitude: 15.00};

const SUNSET_03 = new Date(2012, 3, 3, 18, 0, 0, 0); //6:00pm sunset yesterday
const SUNSET_04 = new Date(2012, 3, 4, 18, 1, 0, 0); //6:01pm sunset today
const SUNSET_05 = new Date(2012, 3, 5, 18, 2, 0, 0); //6:02pm sunset tomorrow
const SUNSET_06 = new Date(2012, 3, 6, 18, 1, 0, 0); //6:01pm sunset then the days star getting shorter again

/////the two sunset dates are identical except for day
expect(SUNSET_03.getFullYear()).to.equal(SUNSET_04.getFullYear());
expect(SUNSET_03.getMonth()).to.equal(SUNSET_04.getMonth());
expect(SUNSET_03.getFullYear()).to.equal(SUNSET_05.getFullYear());
expect(SUNSET_03.getMonth()).to.equal(SUNSET_05.getMonth());

const suncalc = {
  getTimes: function(date, latitude, longitude) {

    ///this fake only works for a small subset of cases
    expect(latitude).to.equal(COORDINATES.latitude);
    expect(longitude).to.equal(COORDINATES.longitude);
    expect(date.getFullYear()).to.equal(SUNSET_03.getFullYear());
    expect(date.getMonth()).to.equal(SUNSET_03.getMonth());

    switch (date.getDate()) {
      case SUNSET_03.getDate():
        return {sunset: SUNSET_03};
      case SUNSET_04.getDate():
        return {sunset: SUNSET_04};
      case SUNSET_05.getDate():
        return {sunset: SUNSET_05};
      case SUNSET_06.getDate():
        return {sunset: SUNSET_06};
    }

    throw new Error('no mock response set for ' + date);
  },
};

// make sure that this file gets 100% code coverage
// since it is easier to see real problem if we expect
// to always have 100% coverage
expect(function() {
  suncalc.getTimes(
    new Date(SUNSET_03.getFullYear(), SUNSET_03.getMonth(), 10, 0, 0, 0),
    COORDINATES.latitude,
    COORDINATES.longitude
  );
}).to.throw();

const sut = proxyquire('../../../src/lib/italian-time', {'suncalc': suncalc});

// five and a half hours before sunset
expect(sut(new Date(
  SUNSET_04.getFullYear(),
  SUNSET_04.getMonth(),
  SUNSET_04.getDate(),
  SUNSET_04.getHours() - 6,
  SUNSET_04.getMinutes() + 30,
  SUNSET_04.getSeconds(),
  SUNSET_04.getMilliseconds()
), COORDINATES)).to.equal(0.75);

// half hour after sunset when the days are getting longer
expect(sut(new Date(
  SUNSET_04.getFullYear(),
  SUNSET_04.getMonth(),
  SUNSET_04.getDate(),
  SUNSET_04.getHours(),
  SUNSET_04.getMinutes() + 30,
  SUNSET_04.getSeconds(),
  SUNSET_04.getMilliseconds() + 1
), COORDINATES)).to.equal(0); // because days are getting longer

// half hour and 30 seconds after sunset when the days are getting longer
expect(sut(new Date(
  SUNSET_04.getFullYear(),
  SUNSET_04.getMonth(),
  SUNSET_04.getDate(),
  SUNSET_04.getHours(),
  SUNSET_04.getMinutes() + 30,
  SUNSET_04.getSeconds() + 30,
  SUNSET_04.getMilliseconds() + 1
), COORDINATES)).to.equal(0); // because days are getting longer
// so the clock will stand still for up to a minute
// while we are waiting until it is less than 24 hours until sunset

// half hour after sunset when the days are getting shorter
// this will cause the clock to jump
expect(sut(new Date(
  SUNSET_05.getFullYear(),
  SUNSET_05.getMonth(),
  SUNSET_05.getDate(),
  SUNSET_05.getHours(),
  SUNSET_05.getMinutes() + 30,
  SUNSET_05.getSeconds(),
  SUNSET_05.getMilliseconds() + 1
), COORDINATES)).to.above(0); // because days are getting shorter
// so the clock will jump a little bit right when the new day starts
// since it is never quite 24 hours until the next nightfall


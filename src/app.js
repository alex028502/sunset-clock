'use strict';

import React from 'react';

import ReactDOM from 'react-dom';
import {createStore} from 'redux';

import {combineReducers} from 'redux';

const formatcoords = require('formatcoords');

const moment = require('moment');

const italianTime = require('./lib/italian-time');
const currentTime = require('./lib/current-time');

const reducer = combineReducers({
  time: require('./reducers/time'),
  coordinates: require('./reducers/coordinates'),
});

let persistedState = null;
let errorMessage = 'using Greenwich until location is updated';
try {
  persistedState = localStorage.getItem('coordinates') && JSON.parse(localStorage.getItem('coordinates'));
} catch (e) {
  errorMessage = `${e} - cannot read location from disk, and might not be able to write`;
}

const initialState = persistedState ? {
  coordinates: persistedState,
} : {
  coordinates: {
    longitude: 0,
    latitude: 51 + 48 / 60,
    error: errorMessage,
  },
};

const store = createStore(reducer, Object.assign({
  time: new Date(),
}, initialState), require('./lib/get-redux-dev-tools-ext')(window));

function saveCoordinates(coordinates) {
  try {
    localStorage.setItem('coordinates', JSON.stringify(coordinates));
  } catch (e) {
    // fail silently - the should have already been warned when reading
  }
}

const render = function() {
  ReactDOM.render(
    <Clock
      time={store.getState().time}
      coordinates={store.getState().coordinates} updateLocation={updateLocation}
    />,
    document.getElementById('root'),
  );
};

startTimer();

function startTimer() {
  setInterval(setTime, 10000);
}

function setTime() {
  store.dispatch({type: 'SET_TIME', value: currentTime()});
}

function updateLocation() {
  navigator.geolocation.getCurrentPosition(function(position) {
    const newCoordinates = {
      longitude: position.coords.longitude,
      latitude: position.coords.latitude,
      error: null,
    };
    store.dispatch({type: 'SET_COORDINATES', value: newCoordinates});
    saveCoordinates(newCoordinates);
  }, function(error) {
    store.dispatch({
      type: 'SET_COORDINATES_ERROR',
      value: error.message,
    });
  });
}

function Clock(props) {
  return <div>
    <ClockFace fraction={italianTime(props.time, props.coordinates)} />
    <p>{formatcoords(props.coordinates.latitude, props.coordinates.longitude).format('DDMMssX', {decimalPlaces: 0})}</p>
    <p style={{color: 'red'}}>{props.coordinates.error ? props.coordinates.error : ''}</p>
    <p>{props.coordinates.timestamp ? `location updated ${formatDate(props.coordinates.timestamp)}` : ''}</p>
    <p><button onClick={props.updateLocation}>update location</button></p>
  </div>;
}

function formatDate(date) {
  return moment(date).calendar().toLowerCase();
}

function ClockFace(props) {
  return <img src="./face.svg"
    style={{ transform: `rotate(${props.fraction * 360}deg)` }}
  />;
}

render();
store.subscribe(render);


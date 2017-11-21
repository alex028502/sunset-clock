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

const persistedState = localStorage.getItem('coordinates') ? {
  coordinates: JSON.parse(localStorage.getItem('coordinates')),
} : {
  coordinates: {
    longitude: 0,
    latitude: 51 + 48 / 60,
    error: 'using Greenwich until location is updated',
  },
};

const store = createStore(reducer, Object.assign({
  time: new Date(),
}, persistedState), require('./lib/get-redux-dev-tools-ext')(window));

store.subscribe(() => {
  // thanks https://stackoverflow.com/a/37690899/5203563
  localStorage.setItem('coordinates', JSON.stringify(store.getState().coordinates));
});

const render = function() {
  ReactDOM.render(
    <Centre>
      <Clock
        time={store.getState().time}
        coordinates={store.getState().coordinates} updateLocation={updateLocation}
      />
    </Centre>,
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
    store.dispatch({type: 'SET_COORDINATES', value: {
      longitude: position.coords.longitude,
      latitude: position.coords.latitude,
      error: null,
    }});
  }, function(error) {
    store.dispatch({
      type: 'SET_COORDINATES_ERROR',
      value: error.message,
    });
  });
}

function Centre(props) {
  return <div style={{'textAlign': 'center'}}>
    { props.children }
  </div>;
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


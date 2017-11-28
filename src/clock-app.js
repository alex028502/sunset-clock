'use strict';

import React from 'react';

import {createStore} from 'redux';

import {combineReducers} from 'redux';

const formatcoords = require('formatcoords');

const italianTime = require('./lib/italian-time');
const currentTime = require('./lib/current-time');

const reducer = combineReducers({
  time: require('./reducers/time'),
  coordinates: require('./reducers/coordinates'),
});

class ClockApp extends React.Component {
  constructor(props) {
    super(props);
    let persistedState = null;
    let errorMessage = 'using Greenwich until location is updated';
    try {
      const savedCoordinates = props.localStorage.getItem('coordinates');
      persistedState = savedCoordinates && JSON.parse(savedCoordinates);
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

    this.store = createStore(reducer, Object.assign({
      time: new Date(),
    }, initialState), require('./lib/get-redux-dev-tools-ext')(window));
  }

  render() {
    return <Clock
      time={this.store.getState().time}
      coordinates={this.store.getState().coordinates} updateLocation={this.updateLocation.bind(this)}
    />;
  }

  componentDidMount() {
    this.timerID = this.props.setInterval(
      this.tick.bind(this),
      10000
    );
    this.store.subscribe(function() {
      this.forceUpdate();
    }.bind(this));
  }

  // ADD THIS IN WHEN THERE IS A TEST THAT UNMOUNTS THE COMPONENT
  // FOR NOW NOTHING EVER GETS UNMOUNTED
  // componentWillUnmount() {
  //   // thanks https://reactjs.org/docs/state-and-lifecycle.html c
  //   clearInterval(this.timerID);
  // }

  tick() {
    this.store.dispatch({type: 'SET_TIME', value: currentTime()});
  }

  saveCoordinates(coordinates) {
    try {
      this.props.localStorage.setItem('coordinates', JSON.stringify(coordinates));
    } catch (e) {
      // fail silently - the should have already been warned when reading
    }
  }

  updateLocation() {
    this.props.geolocation.getCurrentPosition(function(position) {
      const newCoordinates = {
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
        error: null,
      };
      this.store.dispatch({type: 'SET_COORDINATES', value: newCoordinates});
      this.saveCoordinates(newCoordinates);
    }.bind(this), function(error) {
      this.store.dispatch({
        type: 'SET_COORDINATES_ERROR',
        value: error.message,
      });
    }.bind(this));
  }
}

function Clock(props) {
  return <div>
    <ClockFace fraction={italianTime(props.time, props.coordinates)} />
    <p>{formatcoords(props.coordinates.latitude, props.coordinates.longitude).format('DDMMssX', {decimalPlaces: 0})}</p>
    <p style={{color: 'red'}}>{props.coordinates.error ? props.coordinates.error : ''}</p>
    <p><button onClick={props.updateLocation}>update location</button></p>
  </div>;
}

function ClockFace(props) {
  return <img src="./face.svg"
    style={{ transform: `rotate(${props.fraction * 360}deg)` }}
  />;
}

module.exports = ClockApp;


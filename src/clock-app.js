'use strict';

import React from 'react';

import {createStore} from 'redux';

import {combineReducers} from 'redux';

const Coordinates = require('coordinate-parser');


const formatcoords = require('formatcoords');

const italianTime = require('./lib/italian-time');
const currentTime = require('./lib/current-time');

const reducer = combineReducers({
  time: require('./reducers/time'),
  coordinates: require('./reducers/coordinates'),
  page: require('./reducers/page'),
  form: require('./reducers/form'),
});

class ClockApp extends React.Component {
  constructor(props) {
    super(props);
    let persistedState = null;
    let errorMessage = 'using Greenwich until location is updated';

    if (errorMessage && this.isElectron()) {
      errorMessage = 'Choose Set Coordinates from the File menu to change';
    }

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

    initialState.page = this.props.document.location.hash;
    initialState.form = {fieldValue: ''};

    this.store = createStore(reducer, Object.assign({
      time: new Date(),
    }, initialState), require('./lib/get-redux-dev-tools-ext')(window));

    this.props.window.onpopstate = function() {
      this.store.dispatch({type: 'SET_PAGE', value: this.props.document.location.hash});
    }.bind(this);
  }

  render() {
    if (this.store.getState().page === '#set-coordinates') {
      return <CoordinatesForm store={this.store} setCoordinates={this.setCoordinates.bind(this)} />;
    } else {
      return <Clock
        electron={this.isElectron()}
        time={this.store.getState().time}
        coordinates={this.store.getState().coordinates} updateLocation={this.updateLocation.bind(this)}
      />;
    }
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

  isElectron() {
    return this.props.userAgent.indexOf('Electron') !== -1;
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

  setCoordinates(newCoordinates) {
    this.store.dispatch({type: 'SET_COORDINATES', value: newCoordinates});
    this.saveCoordinates(newCoordinates);
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
      this.setCoordinates(newCoordinates);
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
    <p>{formatCoordinates(props.coordinates)}</p>
    <p style={{color: 'red'}}>{props.coordinates.error ? props.coordinates.error : ''}</p>
    { props.electron ? '' : <p><button onClick={props.updateLocation}>update location</button></p> }
  </div>;
}

function formatCoordinates(coordinates) {
  return formatcoords(coordinates.latitude, coordinates.longitude).format('DDMMssX', {decimalPlaces: 0});
}

function ClockFace(props) {
  return <img src="./face.svg"
    style={{ transform: `rotate(${props.fraction * 360}deg)` }}
  />;
}

function interpretCoords(coordinatesString) {
  try {
    const position = new Coordinates(coordinatesString);
    return {
      latitude: position.getLatitude(),
      longitude: position.getLongitude(),
    };
  } catch (e) {
    return false;
  }
}

class CoordinatesForm extends React.Component {
  render() {
    return <div>
      <p>
        Your current location is {formatCoordinates(this.props.store.getState().coordinates)}.
        To change it, use the form below.  Your position does not have to be that accurate to
        estimate how much daylight you have left.  It is probably good enought just to look up
        the city you are in on wikipedia, and copy the coordinates.  When you are finished,
        click <a href="#">here</a> to go back to the sunset clock.
      </p>
      <form onSubmit={this.handleSubmit.bind(this)}>
        <input
          type="text"
          value={this.props.store.getState().form.fieldValue}
          onChange={this.handleChange.bind(this)}
        /><br />
        <button type="submit" disabled={!interpretCoords(this.props.store.getState().form.fieldValue)}>Save</button>
      </form>
    </div>;
  }

  handleChange(event) {
    this.props.store.dispatch({type: 'SET_COORDINATES_FORM_VALUE', value: event.target.value});
  }

  handleSubmit(event) {
    this.props.setCoordinates(Object.assign(
      {},
      interpretCoords(this.props.store.getState().form.fieldValue),
      { error: null },
    ));
    event.preventDefault();
  }
}

module.exports = ClockApp;

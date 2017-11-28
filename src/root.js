'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

const ClockApp = require('./clock-app');



ReactDOM.render(
  <ClockApp geolocation={navigator.geolocation} localStorage={localStorage} setInterval={setIntervalProp} />,
  document.getElementById('root'),
);

function setIntervalProp(action, interval) {
  // without this wrapper I get an error 'illegal invocation'
  // when it tries to call it in componentDidMount
  // but the unit tests all pass
  // so don't delete this wrapper without trying the app in
  // a browser
  setInterval(action, interval);
}

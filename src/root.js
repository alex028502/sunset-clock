'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

const ClockApp = require('./clock-app');

ReactDOM.render(
  <ClockApp window={window} localStorage={localStorage} />,
  document.getElementById('root'),
);


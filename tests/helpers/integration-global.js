/* eslint no-console: 0 */

'use strict';

require('raf/polyfill');

const integerationHelper = require('./integration-helper');

// thanks https://github.com/jesstelford/react-testing-mocha-jsdom
const jsdom = require('jsdom');
const dom = new jsdom.JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
global.document = dom.window.document;
global.window = dom.window;

global.navigator = {
  userAgent: 'node.js', //thanks http://stackoverflow.com/a/37084875/5203563
  geolocation: integerationHelper.props.geolocation,
};

global.setInterval = integerationHelper.props.setInterval;

global.localStorage = integerationHelper.props.localStorage;

global.testVars = integerationHelper.testVars;
global.testVars.dom = dom;
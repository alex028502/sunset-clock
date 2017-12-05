'use strict';

/* eslint no-console: 0 */

const Application = require('spectron').Application;
const expect = require('chai').expect;

require('../tests/helpers/unhandled-rejection');

const app = new Application({
  path: __dirname + '/../dist/sunset-clock-linux-x64/sunset-clock',
  env: {
    SPECTRON_TEMP_DIR: require('./lib/tmp-directory'), // thanks https://github.com/electron/spectron/issues/202
  },
});

const COORDINATES_SETTING = '37°48′49″S 144°57′47″E';

const INITIAL_MESSAGE = 'Choose Set Coordinates from the File menu to change';

// TODO: use extract-angle method

(async function() {
  await app.start();

  let html = await app.client.getHTML('body');

  expect(html).to.include('face.svg');
  expect(html).not.to.include(COORDINATES_SETTING);
  expect(html).to.include(INITIAL_MESSAGE);

  const initialRotation = await app.client.getAttribute('img', 'style');
  expect(initialRotation).to.include('transform: rotate');

  const url = await app.client.url();

  // TODO: is it possible to select a dropdown with spectron???
  app.client.url(url.value + '#set-coordinates');

  html = await app.client.getHTML('body');
  expect(html).not.to.include('face.svg');
  await app.client.addValue('input[type=text]', COORDINATES_SETTING);
  await app.client.click('button');
  html = await app.client.getHTML('body');
  expect(html).not.to.include('face.svg');
  expect(html).to.include(COORDINATES_SETTING);
  await app.client.click('a');
  html = await app.client.getHTML('body');
  expect(html).to.include('face.svg');
  expect(html).to.include(COORDINATES_SETTING);
  expect(html).not.to.include(INITIAL_MESSAGE);

  const newRotation = await app.client.getAttribute('img', 'style');
  expect(newRotation).to.include('transform: rotate');

  expect(newRotation).not.to.equal(initialRotation);

  const browserLogs = await app.client.log('browser');

  expect(browserLogs.value.filter(function(entry) {
    return entry.level !== 'INFO';
  })).to.have.lengthOf(0, JSON.stringify(browserLogs));

  await stopIfRunning(app);
  await stopIfRunning(app); // a second time so all branches run
  await app.start();

  html = await app.client.getHTML('body');
  expect(html).to.include('face.svg');
  expect(html).to.include(COORDINATES_SETTING);
  expect(html).not.to.include(INITIAL_MESSAGE);

  console.log('seems to work as expected in electron');
})().finally(async function() {
  await stopIfRunning(app);
});

async function stopIfRunning(app) {
  const running = await app.isRunning();
  if (running) {
    await app.stop();
  }
}

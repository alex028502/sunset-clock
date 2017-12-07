'use strict';

/* eslint no-console: 0 */

// https://github.com/SeleniumHQ/selenium/wiki/WebDriverJs

const fs = require('fs');

const expect = require('chai').expect;
const axios = require('axios');
const portfinder = require('portfinder');

const formatCoordinates = require('../../../src/lib/format-coordinates');

const webdriver = require('selenium-webdriver');

const By = webdriver.By;

require('../../../lib/unhandled-rejection');

const app = require('../../../demo/lib');

const skipForOtherBrowsers = require('./skip-for-other-browsers');

const fakeLocationSource = fs.readFileSync(__dirname + '/fake-location.js', 'utf8');
const TOKYO = {
  latitude: '35.6895', // correct format for formatter
  longitude: '139.6917',
};

// instead of extracting the coordinates from the location source
// let's just hard code it in two places and then assert that they are the same
expect(fakeLocationSource).to.include(TOKYO.latitude);
expect(fakeLocationSource).to.include(TOKYO.longitude);

let driver;
let server;

// I'm not totally sure if this needs to be set with the version
// we are using but set it anyhow
expect(process.env.SELENIUM_PROMISE_MANAGER).to.equal('0');

const SECOND_VERSION_KEY = 'second-version-test-key';

const extractAngle = require('../../../lib/extract-angle');

// just check the angle helper does what it should

expect(angleBetween(200, 300)).to.equal(100);
expect(angleBetween(350, 100)).to.equal(110);

expect(function() {
  checkForDinosaurPage('text including This site can’t be reached', 'test');
}).to.throw();

expect(function() {
  checkForDinosaurPage('other text', 'test');
}).not.to.throw();

// since this test checks the compiled public folder
// it is a good place to make sure that all the files in the file list
// are present
for (const file of require('../../../src/lib/file-list.json')) {
  const fullPath = `${__dirname}/../../../public/${file}`;
  expect(fs.existsSync(fullPath)).to.equal(true, fullPath);
}
// TODO: also check that all the files we need _are_ in the list

const PUBLIC_DIRECTORY = `${__dirname}/../../../public`;

(async function() {
  const port = await portfinder.getPortPromise();
  const URL = `http://localhost:${port}/`;

  await runIfExists(null, 'method'); // just to prove this works for when we need it
  server = await app(PUBLIC_DIRECTORY, port);

  // while experimenting we tried pointing it at a different binary
  // like this
  // since the docs were really hard to find
  // I'll just leave it here in a comment for a while in case I need it
  // thanks https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/chrome.html
  // const chrome = require('selenium-webdriver/chrome');
  // const options = new chrome.Options();
  // options.setChromeBinaryPath(__dirname + '/../tmp/chrome-linux/chrome');
  // .setChromeOptions(options)
  driver = await new webdriver.Builder().forBrowser('chrome').setLoggingPrefs({
    browser: 'ALL',
  }).build();

  // just show we can also get it without the browser
  expect(await isWebsiteRunning(URL)).to.be.ok;

  await driver.get(URL);

  await sleep(200); // TODO: wait for load

  await driver.getPageSource().then(function(source) {
    checkForDinosaurPage(source, URL);
    expect(source).to.include('preparing');
    expect(source).to.include('face.svg');
  });

  await sleep(6000); // the message is shown for a long time to make the demo better

  const angleInGreenwich = await driver.getPageSource().then(function(source) {
    expect(source).not.to.include('preparing');
    expect(source).to.include('face.svg');
    expect(source).to.include('update location');
    expect(source).to.include('51°47′60″N');
    expect(source).to.include('Greenwich');
    return extractAngle(source);
  });

  // now make sure we can update our location
  await driver.executeScript(fakeLocationSource); // run this before trying

  await driver.findElement(By.tagName('button')).click();

  await sleep(200);

  const angleInTokyo = await driver.getPageSource().then(function(source) {
    expect(source).not.to.include('preparing');
    expect(source).to.include('face.svg');
    expect(source).to.include('update location');
    expect(source).to.include(formatCoordinates(TOKYO));
    expect(source).not.to.include('Greenwich');
    return extractAngle(source);
  });

  // the difference in the dial also depends on latitude but since the difference
  // in longitude is 140 degrees, I'm sure the dials are at least 100 degrees apart
  expect(angleBetween(parseFloat(angleInGreenwich), parseFloat(angleInTokyo))).to.be.above(100);

  await server.stop(); // turn off the server so that we can see if the service worker registered

  expect(await isWebsiteRunning(URL)).not.to.be.ok;
  // just to make sure it is really off

  await driver.get(URL);
  await sleep(200); // TODO: wait for load
  await driver.getPageSource().then(function(source) {
    expect(source).not.to.include('preparing');
    expect(source).to.include('face.svg');
    expect(source).to.include('update location');
    expect(source).to.include(formatCoordinates(TOKYO)); // should still have coordinates
    expect(source).not.to.include('Greenwich');
  });

  server = await app(PUBLIC_DIRECTORY, port, SECOND_VERSION_KEY);

  await driver.get(URL);
  await sleep(200); // TODO: wait for load
  await driver.getPageSource().then(function(source) {
    // see if we can first check it before the update
    expect(source).not.to.include('preparing');
    expect(source).to.include('face.svg');
    expect(source).to.include('update location');
    expect(source).to.include(formatCoordinates(TOKYO)); // should still have coordinates
    expect(source).not.to.include('Greenwich');
    expect(source).not.to.include(SECOND_VERSION_KEY);
  });

  // but in a few seconds it will reload
  await driver.get(URL);
  await sleep(5000); // TODO: wait for load
  await driver.getPageSource().then(function(source) {
    expect(source).not.to.include('preparing');
    expect(source).to.include('face.svg');
    expect(source).to.include('update location');
    expect(source).to.include(formatCoordinates(TOKYO)); // should still have coordinates
    expect(source).not.to.include('Greenwich');
    expect(source).to.include(SECOND_VERSION_KEY);
  });

  await server.stop(); // turn off the server so that we can see if the service worker registered

  await isWebsiteRunning(URL).then(function(running) {
    // just to make sure it is really off
    expect(running).not.to.be.ok;
  });

  await driver.get(URL);
  await sleep(200); // TODO: wait for load
  const angleBeforeTick = await driver.getPageSource().then(function(source) {
    expect(source).not.to.include('preparing');
    expect(source).to.include('face.svg');
    expect(source).to.include('update location');
    expect(source).to.include(formatCoordinates(TOKYO)); // should still have coordinates
    expect(source).not.to.include('Greenwich');
    expect(source).to.include(SECOND_VERSION_KEY);
    return extractAngle(source);
  });

  await sleep(10000); // ticks every ten seconds

  const angleAfterTick = await driver.getPageSource().then(function(source) {
    expect(source).not.to.include('preparing');
    expect(source).to.include('face.svg');
    expect(source).to.include('update location');
    expect(source).to.include(formatCoordinates(TOKYO)); // should still have coordinates
    expect(source).not.to.include('Greenwich');
    expect(source).to.include(SECOND_VERSION_KEY);
    return extractAngle(source);
  });

  const EXPECTED_SIZE_OF_TICK = 360 / 24 / 60 / 6;
  const amountClockHasMoved = angleBetween(parseFloat(angleBeforeTick), parseFloat(angleAfterTick));
  // show the clock ticks at roughly the rate it should
  expect(amountClockHasMoved).to.be.above(0.95 * EXPECTED_SIZE_OF_TICK);
  expect(amountClockHasMoved).to.be.below(1.05 * EXPECTED_SIZE_OF_TICK);

  await skipForOtherBrowsers(function() {
    return getNonInfoLogs(driver).then(function(logs) {
      expect(logs).to.have.lengthOf(0);
    });
  });
})().finally(async function() {
  await skipForOtherBrowsers(function() {
    return runIfExists(driver, function() {
      return driver.manage().logs().get('browser').then(function(logs) {
        console.log(logs);
      });
    });
  });

  await runIfExists(driver, function() {
    return driver.quit();
  });
});

function runIfExists(obj, command) {
  if (obj) {
    return command();
  }
  return null;
}

function isWebsiteRunning(URL) {
  return axios.get(URL).then(function() {
    return true;
  }).catch(function() {
    return false;
  });
}

function getNonInfoLogs(driver) {
  return driver.manage().logs().get('browser').then(function(logs) {
    return logs.filter(function(entry) {
      return entry.level.name !== 'INFO';
    });
  });
}

function sleep(interval) {
  return new Promise(function(resolve) {
    setTimeout(resolve, interval);
  });
}

function angleBetween(start, end) {
  if (end > start) {return end - start;}
  return end - start + 360;
}

function checkForDinosaurPage(source, url) {
  if (source.indexOf('This site can’t be reached') !== -1) {
    throw new Error(`looks like we couldn't reach ${url}`);
  }
}

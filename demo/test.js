'use strict';

/* eslint no-console: 0 */

const fs = require('fs');
const expect = require('chai').expect;
const portfinder = require('portfinder');
const axios = require('axios');

const extractVersion = require('./lib/extract-version');

require('../lib/unhandled-rejection');

const sut = require('.');

const TEST_HASH = 'modified-hash-for-testing-service-worker';
const TEST_DIRECTORY = `${__dirname}/public`;

expect(countSubstring('xx', 'yy')).not.to.be.ok;
expect(countSubstring('xx', 'xxx')).to.equal(1);
expect(countSubstring('xx', 'xxxx')).to.equal(2);

for (const filename of fs.readdirSync(TEST_DIRECTORY)) {
  // every file should include its own name
  const name = filename.split('.')[0];
  const ext = filename.split('.')[1];
  if (ext !== 'js' && ext !== 'html') {
    continue;
  }
  const content = fs.readFileSync(`${TEST_DIRECTORY}/${filename}`, 'utf8');
  expect(content).to.include(name, filename);
}

(async function() {
  // start the server with no arguments
  let server;
  let port = await portfinder.getPortPromise();

  // server doesn't work until we turn it on

  await makeSureServerIsOff(port);

  server = await sut(TEST_DIRECTORY, port); // start server without modifying hash

  expect(server).to.have.property('stop');
  expect(server.stop).to.be.a('function');

  await get(port, '').then(function(response) {
    expect(response.status).to.equal(301);
    expect(response.headers['location']).to.equal('/sunset-clock/');
  });

  await get(port, 'sunset-clock').then(function(response) {
    expect(response.status).to.equal(301);
    expect(response.headers['location']).to.equal('/sunset-clock/');
  });

  const redirectPage = await get(port, 'sunset-clock/index.html').then(function(response) {
    expect(response.status).to.equal(200);
    expect(response.data).to.include('index'); // this page sends you to main or reloads it from the cache
    return response.data;
  });

  await get(port, 'sunset-clock/').then(function(response) {
    expect(response.status).to.equal(200);
    expect(response.data).to.equal(redirectPage); // just make sure it works with no filename
  });

  const serviceWorker0 = await get(port, 'sunset-clock/service-worker.js').then(function(response) {
    expect(response.status).to.equal(200);
    expect(response.data).to.include('service-worker');
    return response.data;
  });

  const indexHtml0 = await get(port, 'sunset-clock/main.html').then(function(response) {
    expect(response.status).to.equal(200);
    expect(response.data).to.include('main');
    return response.data;
  });

  expect(indexHtml0).not.to.equal(redirectPage);

  const versionHash0 = extractVersion(serviceWorker0);
  // make sure we have the hash in there twice
  // once in the banner at the top and once inline where it is used
  expect(countSubstring(versionHash0, serviceWorker0)).to.equal(2, versionHash0);

  // the hash should not appear in the original version
  // only in the modified versions
  expect(indexHtml0).not.to.include(versionHash0);

  await server.stop();

  // now make sure it is really turned off

  // it works here but it still might not if the browser is open
  await makeSureServerIsOff(port);

  // now start it and modify the hash
  // which will allow us to start the app with a different service worker
  // and a different index so that we can see our browser reload it
  server = await sut(TEST_DIRECTORY, port, TEST_HASH);

  const serviceWorkerModified = await get(port, 'sunset-clock/service-worker.js').then(function(response) {
    expect(response.status).to.equal(200);
    return response.data;
  });

  await get(port, 'sunset-clock/other.js').then(function(response) {
    expect(response.status).to.equal(200);
    expect(response.data).to.include('other');
    expect(response.data).not.to.include(TEST_HASH);
    return response.data;
  });

  await get(port, 'sunset-clock/other.html').then(function(response) {
    expect(response.status).to.equal(200);
    expect(response.data).to.include('other');
    expect(response.data).not.to.include(TEST_HASH);
    return response.data;
  });

  const indexHtmlModified = await get(port, 'sunset-clock/main.html').then(function(response) {
    expect(response.status).to.equal(200);
    return response.data;
  });

  await get(port, 'sunset-clock/index.html').then(function(response) {
    // this page should not change
    expect(response.status).to.equal(200);
    expect(response.data).to.equal(redirectPage);
  });

  await get(port, 'sunset-clock/').then(function(response) {
    // this page should not change
    expect(response.status).to.equal(200);
    expect(response.data).to.equal(redirectPage);
  });

  expect(serviceWorkerModified).not.to.include(versionHash0);
  expect(serviceWorkerModified).to.include(TEST_HASH);
  expect(countSubstring(TEST_HASH, serviceWorkerModified)).to.equal(2);

  // this time it should be printed somewhere in the html
  // so that we can see it load the modified version

  expect(indexHtmlModified).to.include(TEST_HASH);
  expect(countSubstring(TEST_HASH, indexHtmlModified)).to.equal(1);
  expect(indexHtmlModified).not.to.include(versionHash0);

  await server.stop();

  console.log('test dev server seems to work');
})();

function get(port, path) {
  return axios.get(`http://localhost:${port}/${path}`, {
    maxRedirects: 0,
  }).then(function(response) {
    return response;
  }, function(error) {
    if (error.response) {
      return error.response;
    }
    throw error;
  });
}

function countSubstring(needle, haystack) {
  // thanks https://stackoverflow.com/a/874722/5203563
  // thanks https://stackoverflow.com/a/4009768/5203563
  return (haystack.match(RegExp(needle, 'g')) || []).length;
}

function makeSureServerIsOff(port) {
  // TODO: is there a way to use expect.to.throw with await?
  return get(port, 'sunset-clock/index.html').catch(function(e) {
    expect(`${e}`).to.include('ECONNREFUSED');
    return 'GOT EXPECTED ERROR';
  }).then(function(result) {
    expect(result).to.equal('GOT EXPECTED ERROR');
  });
}

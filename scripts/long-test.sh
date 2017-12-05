#! /bin/bash

set -ev

echo this will run each test set individually with its dependencies
echo to make sure that all the test commands work properly
echo and has the correct dependencies configured

ls scripts/long-test.sh || (echo run from root && exit 1)

./scripts/clean.sh

npm install

npm run unit-test
npm run unit-test

npm run lint

npm run demo-test
npm run demo-test

./scripts/sweep.sh

npm run electron-e2e-test
npm run electron-e2e-test

./scripts/sweep.sh

npm run browser-e2e-test
npm run browser-e2e-test

./scripts/sweep.sh

npm test
npm test

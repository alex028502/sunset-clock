#! /bin/bash

set -ev

# this script run the tests to make sure they pass
# but also makes sure that the test commands work properly
# and that all the prerequisites are covered
# by clearing the compiled versions before each test

ls scripts/run-all-tests.sh || (echo run from root && exit 1)

./scripts/sweep.sh

npm run unit-test

./scripts/sweep.sh

npm run demo-test

./scripts/sweep.sh

npm run lib-test

./scripts/sweep.sh

npm run browser-e2e-test

./scripts/sweep.sh

npm run electron-e2e-test

npm run lint

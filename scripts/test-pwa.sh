#! /bin/bash

set -ev

ls scripts/test-pwa.sh || (echo run from root && exit 1)

export SELENIUM_PROMISE_MANAGER=0

# needs babel-node because of 'finally'
./node_modules/.bin/babel-node tests/e2e/browser
SELENIUM_BROWSER=firefox ./node_modules/.bin/babel-node tests/e2e/browser

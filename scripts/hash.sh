#!/usr/bin/env bash

set -e

# makes a hash of all the files that are cached by the service worker

# TODO: is there a better way to get a hash of all the files?

./scripts/sw-files.js | xargs cat | md5sum | awk '{ print $1 }'

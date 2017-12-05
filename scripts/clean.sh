#! /bin/bash

set -e

ls scripts/clean.sh || (echo run from project root && exit 1)

echo this will clean out most generated and downloaded files
echo
echo

# do not clean from the root in case there are important
# temporary files in ignored directories
# like IDE settings
./scripts/sweep.sh
rm -rf node_modules
echo
echo did not delete the following temporary files
./scripts/temp-files.sh .

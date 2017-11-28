#! /bin/bash

ls scripts/clean.sh || (echo run from project root && exit 1)

echo this will clean out most generated and downloaded files
echo
echo

# do not clean from the root in case there are important
# temporary files in ignored directories
# like IDE settings
./scripts/temp-files.sh public | xargs --no-run-if-empty rm -rvf
./scripts/temp-files.sh tmp | xargs --no-run-if-empty rm -rvf
./scripts/temp-files.sh dist | xargs --no-run-if-empty rm -rvf
rm -rf node_modules
rm -rfv .nyc_output
echo
echo did not delete the following temporary files
./scripts/temp-files.sh .

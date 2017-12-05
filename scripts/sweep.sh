#! /bin/bash

set -e

ls scripts/sweep.sh || (echo run from root && exit 1)

./scripts/temp-files.sh public | xargs --no-run-if-empty rm -rvf
./scripts/temp-files.sh tmp | xargs --no-run-if-empty rm -rvf
./scripts/temp-files.sh dist | xargs --no-run-if-empty rm -rvf
rm -rfv .nyc_output

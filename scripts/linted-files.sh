#!/usr/bin/env bash

set -e

# this lists all the files that we lint so that we can make sure
# we are using the same list for linting and fixing

# filter out node_modules because checking every vendor file against
# gitignore is quite slow
find . -name "*.js" | grep -v node_modules | git check-ignore --stdin -v -n | grep -v .gitignore | awk '{print $2}'

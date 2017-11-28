#!/usr/bin/env bash

set -e

# this is the list of files that can be deleted before running a build
# since generated files that no longer exist are generally left in the gitignore
# file, hopefully they will be deleted too if left over from a previous version

find $1 | git check-ignore --stdin -v -n | grep -v :: | awk '{ print $2 }'

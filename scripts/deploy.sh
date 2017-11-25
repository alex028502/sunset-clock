#! /usr/bin/env bash

set -e

# allows you to use a compiled demo in the docs without
# adding compiled code to the main branch

ls scripts/deploy.sh || (echo only run from project root && exit 1)

VERSION=$(git rev-parse HEAD)
STATUS=$(git status)
DIFF=$(git diff)
DEMO_PATH=./deploy/demo
REPO=$(git config --get remote.origin.url)

rm -rf $DEMO_PATH
mkdir $DEMO_PATH
cp -r public/* $DEMO_PATH/ # this will skip files starting with .
git -C $DEMO_PATH init
git -C $DEMO_PATH config user.email "cd@example.com"
git -C $DEMO_PATH config user.name "Continuous Deployment"
git -C $DEMO_PATH remote add origin $REPO
git -C $DEMO_PATH add -A
git -C $DEMO_PATH commit -m"build version $VERSION

$STATUS

$DIFF

[ci skip]
"
git -C $DEMO_PATH push origin HEAD:gh-pages -f

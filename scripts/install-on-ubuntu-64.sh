#!/usr/bin/env bash

set -ev

ls scripts/install-on-ubuntu-64.sh || (echo run from project root && exit 1)

sudo rm -rf /opt/sunset-clock
sudo cp -r dist/sunset-clock-linux-x64 /opt/sunset-clock
sudo cp dist/sunset-clock.desktop /usr/share/applications/

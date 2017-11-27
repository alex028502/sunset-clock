#! /usr/bin/env bash

set -e

ls scripts/serve.sh || (echo only run from project root && exit 1)

PORT=8443
IMAGE=marvambass/nginx-ssl-secure

echo this serves the web app over https to anybody on the LAN with a self-signed
echo certificate.  It can be used to try the location service on an ios safari.
echo Chrome requires an approved certificate, so you have to map the ports using
echo chrome dev tools.
echo The url of the app might be somewhere in this list:
hostname -I | xargs printf "%s\n" | xargs -I {} echo https://{}:$PORT

docker run -p $PORT:443 -e 'DH_SIZE=512' -v $(pwd)/nginx:/etc/nginx/external/ -v $(pwd)/public:/usr/share/nginx/html/sunset-clock:ro $IMAGE

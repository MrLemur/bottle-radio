#!/bin/bash

echo "Checking for dependencies..."
if ! which htpasswd; then
    echo "Missing htpasswd, exiting..."
    exit 1
fi

source ./.env

export ENC_PASSWD=$(htpasswd -b -B -n $MOPIDY_USERNAME $MOPIDY_PASSWORD | awk -F":" '{printf $2}')
sed -i "s@MOPIDY_ENCRYPTED_PASSWORD=\$@MOPIDY_ENCRYPTED_PASSWORD=$ENC_PASSWD@g" .env

echo "Pulling the latest images..."
docker-compose pull

echo
echo "Starting the containers in the background ..."
docker-compose build frontend
docker-compose build mopidy
docker-compose build icecast
docker-compose up -d

echo
echo "Containers are now started..."
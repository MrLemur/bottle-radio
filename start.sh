#!/bin/bash

echo "Checking for dependencies..."
if ! which htpasswd; then
    echo "Missing htpasswd, exiting..."
    exit 1
fi

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
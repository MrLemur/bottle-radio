#!/bin/bash

echo "Pulling the latest images..."
docker-compose pull

echo
echo "Starting the containers in the background ..."
docker-compose up -d

echo
echo "Containers are now started..."
#!/bin/sh

echo "Waiting for MongoDB to start..."
./wait-for mongo1:27017 

echo "Waiting for MongoDB to start..."
./wait-for mongo2:27017 

echo "Migrating the first database..."
npm run mongo1:up

echo "Migrating the second database..."
npm run mongo2:up

echo "Starting the server..."
npm start 
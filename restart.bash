#!/bin/bash

docker container stop spotify_ranker
docker container rm spotify_ranker
docker image rm spotify_ranker:latest
git pull
docker build -t spotify_ranker .
docker compose up

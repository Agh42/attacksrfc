#!/bin/bash

docker run \
        --name cve-mongo \
        --network=cve-network \
        -v /home/docker/mongodb:/data/db   \
        -p 27017:27017 \
        -d mongo

docker run -it --network=cve-network --name cvesearch cvesearch

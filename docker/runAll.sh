#!/bin/bash

docker run \
        --name cve-mongo \
        --network=cve-network \
        -v /home/docker/mongodb:/data/db   \
        -p 27017:27017 \
        -d mongo

#docker run -it --network=cve-network --name cvesearch cvesearch

# run container with bash:
#docker  run --network=cve-network --name cvesearch -it cvesearch bash
# stops after strg-D
# restart container (with bash again) and atach to it:
#docker start cvesearch
#docker attach cvesearch


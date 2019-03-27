#!/bin/bash

npm install

cp -R $GITHUB_WORKSPACE/build /tmp/tfjs-node

cd /tmp/build-tfjs-node

npm install

cd $GITHUB_WORKSPACE

node build.js

#!/bin/bash

npm install

cp -R $GITHUB_WORKSPACE/build /tmp/tfjs-node

cd /tmp/tfjs-node

npm install

cd $GITHUB_WORKSPACE

node build.js

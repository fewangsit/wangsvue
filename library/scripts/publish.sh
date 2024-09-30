#!/bin/bash

cd dist
# npm link and publish
npm link
npm publish

cd ../

echo "Publish tasks completed successfully!"
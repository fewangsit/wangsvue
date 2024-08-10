#!/bin/bash

cp package.json dist/

# Change directory to 'dist'
cd dist

# npm link and publish
npm link
npm publish

# Change back to the original directory
cd ..

echo "Post-build tasks completed successfully!"
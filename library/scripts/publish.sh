#!/bin/bash

cd dist
# npm link and publish
npm link
npm publish

cd ../
rm -r dist

echo "Publish tasks completed successfully!"
git push origin main
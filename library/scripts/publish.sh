#!/bin/bash

# Get the updated version
VERSION=$(jq -r '.version' package.json)

# Change directory to 'dist'
cd dist

# Get the version from the main package.json

# Create a new package.json with the desired content, including the dynamic version
cat << EOF > package.json
{
  "name": "wangsvue",
  "version": "${VERSION}", 
  "author": "fewangsit",
  "description": "Wangsit VueJS Component Library",
  "module": "./wangsvue.es.js",
  "types": "./main.d.ts",
  "exports": {
    ".": "./wangsvue.es.js",
    "./style.css": "./style.css",
    "./colors.config.json": "./colors.config.json"
  }
}
EOF

# npm link and publish
npm link
npm publish

# Change back to the original directory
cd ..

echo "Post-build tasks completed successfully!"
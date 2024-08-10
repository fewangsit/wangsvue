#!/bin/bash

# Get the updated version
VERSION=$(jq -r '.version' package.json)

# Change directory to 'dist'
cd library/dist

# Get the version from the main package.json

# Create a new package.json with the desired content, including the dynamic version
cat << EOF > package.json
{
  "name": "wangsvue",
  "version": "${VERSION}", 
  "description": "Global reusable components for micro frontend",
  "module": "./wangsvue.es.js",
  "types": "./main.d.ts",
  "exports": {
    ".": {
      "types": "./main.d.ts",
      "import": "./wangsvue.es.js"
    }
  }
}
EOF

# npm link and publish
npm link
npm publish

# Change back to the original directory
cd ..

echo "Post-build tasks completed successfully!"
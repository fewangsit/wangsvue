#!/bin/bash

# Function to show how to use the script (optional)
usage() {
  echo "Usage: sh build.sh <preset_name>"
  echo "<preset_name> The preset name to build (e.g., wangsvue)."
  exit 1
}

# Get the preset name from the first argument
preset="$1"

# Check if the preset name is provided (recommended)
if [[ -z "$preset" ]]; then
  usage
fi

# Build the preset
inputDir="./${preset}"
outputDir="./dist/${preset}"

tailwind -i "${inputDir}/index.css" -o "${outputDir}/style.css" --config "./${preset}/tailwind.config.js" --watch
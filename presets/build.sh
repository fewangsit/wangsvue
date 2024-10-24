#!/bin/bash

# Remove previous build
rm -rf dist

# Create type declaration
tsc ./index.ts --declaration --allowJs --outDir dist
npx rollup -c

# Preset names array
presetNames=("wangsvue")

# Loop through the array and run Tailwind CSS for each preset
for preset in "${presetNames[@]}"; do
  inputDir="./${preset}"
  outputDir="./dist/${preset}"

  cp "${inputDir}/colors.config.json" "${outputDir}/colors.config.json"

  # Run Tailwind CSS
  tailwind -i "${inputDir}/index.css" -o "${outputDir}/style.css" --config "./${preset}/tailwind.config.js"
done
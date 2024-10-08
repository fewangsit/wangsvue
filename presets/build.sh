#!/bin/bash

# Remove previous build
rimraf dist

# Create type declaration
tsc ./index.ts --declaration --allowJs --outDir dist

# Preset names array
presetNames=("wangsvue")

# Loop through the array and run Tailwind CSS for each preset
for preset in "${presetNames[@]}"; do
  input="./${preset}/index.css"
  output="./dist/${preset}/style.css"

  # Run Tailwind CSS
  tailwind -i "${input}" -o "${output}" --config "./${preset}/tailwind.config.js"
done
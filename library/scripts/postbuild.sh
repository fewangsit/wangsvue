#!/bin/bash

cp colors.config.json dist
cp types dist

source_directory="./components"
target_directory="./dist/components"

for file in "$source_directory"/**/*.d.ts; do
  if [[ -f "$file" ]]; then 
    relative_path="${file#$source_directory/}" # Extract the relative path from the source directory
    target_file="$target_directory/$relative_path"
    mkdir -p "$(dirname "$target_file")" # Create the target directory if it doesn't exist
    cp "$file" "$target_file"
    echo "Copied $file to $target_file"
  fi
done

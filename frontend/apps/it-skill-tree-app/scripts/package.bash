#!/bin/bash
# makes sure the folder containing the script will be the root folder
cd "$(dirname "$0")" || exit

if [[ -d "../dist" ]]; then
  #  get project name from package.json
  PROJECT_NAME=$(node -p "require('../package.json').name.split('/').pop()")
  echo "📦  Package $PROJECT_NAME"
  mkdir -p ../../../../package/apps/$PROJECT_NAME
  cp -rfv ../dist/* ../../../../package/apps/$PROJECT_NAME
fi
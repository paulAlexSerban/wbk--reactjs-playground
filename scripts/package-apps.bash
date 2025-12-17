#!/bin/bash
# makes sure the folder containing the script will be the root folder
cd "$(dirname "$0")" || exit

# clean up previous packages
rm -rfv ../package/*

# Loop through all apps in the frontend/apps directory
for APP_PATH in ../frontend/apps/*; do
  if [[ -d "$APP_PATH/dist" ]]; then
    #  get project name from package.json
    PROJECT_NAME=$(node -p "require('$APP_PATH/package.json').name.split('/').pop()")
    REPOSITORY_NAME=$(node -p "require('$APP_PATH/package.json').name.split('/').shift().replace('@','')")
    echo "📦  Package $PROJECT_NAME"
    mkdir -p ../package/$REPOSITORY_NAME/apps/$PROJECT_NAME
    cp -rfv "$APP_PATH/dist/"* ../package/$REPOSITORY_NAME/apps/$PROJECT_NAME
  fi
done

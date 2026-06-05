#!/bin/bash
# makes sure the folder containing the script will be the root folder
cd "$(dirname "$0")" || exit

# clean up previous packages
rm -rfv ../package/*

REPOSITORY_NAME=$(node -p "require('../package.json').name.split('/')[0].split('@')[1]")
echo "📦  Packaging frontend for $REPOSITORY_NAME"

# Loop through all apps in the libraries directory
for PROJECT_PATH in ../frontend/*/*; do
  echo "📦  Packaging $PROJECT_PATH"
  if [[ -d "$PROJECT_PATH/dist" ]]; then
    PROJECT_NAME=$(node -p "require('$PROJECT_PATH/package.json').name.split('/')[1].split('__')[0]")

    
    echo "📦  Package $PROJECT_NAME"
    mkdir -p ../package/$REPOSITORY_NAME/$PROJECT_NAME
    cp -rfv "$PROJECT_PATH/dist/"* ../package/$REPOSITORY_NAME/$PROJECT_NAME
  fi
done

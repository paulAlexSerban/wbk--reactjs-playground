#!/bin/bash
# makes sure the folder containing the script will be the root folder
cd "$(dirname "$0")" || exit

APP_PATH="../dashboard"

if [[ -d "$APP_PATH/dist" ]]; then
  cp -rfv $APP_PATH/dist/* ../package/wbk--reactjs-playground/
fi
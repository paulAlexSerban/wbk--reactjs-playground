#!/bin/bash
# makes sure the folder containing the script will be the root folder
cd "$(dirname "$0")" || exit
yarn --cwd ../ lerna version --no-push --yes

# format checngelogs
yarn --cwd ../ formats:write

# Add changes to the staging area
git add .

# Commit the changes
git commit -m "chore(release): publish"

# Lastly, you might push tags manually if desired
git push --tags
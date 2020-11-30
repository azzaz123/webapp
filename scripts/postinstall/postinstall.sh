#!/bin/bash

echo "Removing unused moment locales..."
node scripts/postinstall/remove-unused-moment-locales.js

echo "Setting up default docker..."
sh scripts/docknum/update.sh 121

echo "Sync githooks with husky..."
husky install

echo "Running Angular compatibility compiler..."
ngcc
#!/bin/bash

echo "Removing unused moment locales..."
node scripts/postinstall/remove-unused-moment-locales.js

echo "Sync githooks with husky..."
husky install

echo "Running Angular compatibility compiler..."
ngcc
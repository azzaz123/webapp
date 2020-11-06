#!/bin/bash

libphonenumber-generate-metadata ./src/assets/js/metadata-phonenumber.js --countries ES --extended && 
echo "export const metadata = $(cat ./src/assets/js/metadata-phonenumber.js)" > ./src/assets/js/metadata-phonenumber.js
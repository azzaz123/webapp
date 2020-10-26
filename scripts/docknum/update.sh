#!/bin/bash

# Create/update a Typescript file with the docknum passed by parameter
# Example `./update.sh 123`

docknum=$1

if [ -z $1 ]
then
  docknum=111
fi

docknumPath="src/environments/"
docknumFileName="docknum.ts";
docknumContent="export const dockNum = '${docknum}';";

echo $docknumContent > ${docknumPath}${docknumFileName}
echo "Using docker ${docknum}"
#!/bin/bash

COVERAGE_PATH="./coverage/lcov-report/index.html"

if which xdg-open > /dev/null
then
  xdg-open "$COVERAGE_PATH"
  exit 
fi

if which gnome-open > /dev/null
then
  gnome-open "$COVERAGE_PATH"
  exit
fi

if which open > /dev/null
then
  open "$COVERAGE_PATH"
  exit
fi

echo "Can not automatically open coverage report"
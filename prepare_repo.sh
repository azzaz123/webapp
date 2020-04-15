#!/bin/bash

HOOK_DIR=$(git rev-parse --show-toplevel)/.git/hooks

ln -s -f ../../githooks/commit-msg $HOOK_DIR/commit-msg

./scripts/docknum/update.sh 111
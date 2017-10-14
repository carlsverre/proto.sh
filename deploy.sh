#!/usr/bin/env bash

set -e

REMOTE=proto
ROOT=/srv/www-proto-sh

npm run build
rsync -avzr --progress public/ ${REMOTE}:${ROOT}

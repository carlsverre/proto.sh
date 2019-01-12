#!/usr/bin/env bash

set -e

REMOTE=proto
ROOT=/srv/sh/proto/www

npm run build
rsync -avzr --progress public/ ${REMOTE}:${ROOT}

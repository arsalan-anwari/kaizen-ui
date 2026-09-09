#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/docs"
npm install
npm run build
npm run shots

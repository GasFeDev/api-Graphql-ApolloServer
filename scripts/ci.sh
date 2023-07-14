#!/bin/bash
set -euo pipefail

PATH=./node_modules/.bin:$PATH
CHANGED=$(yarn --silent lerna exec pwd --since origin/master --loglevel error)
JEST="node --expose-gc ./node_modules/.bin/jest --coverage --ci --silent --maxWorkers=4 --logHeapUsage"

echo "Changed:" $CHANGED

# Run everything, including integration tests.
$JEST

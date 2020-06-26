#!/bin/bash
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"
node --experimental-loader ../lib/hyper-loader.js ./bkr.js
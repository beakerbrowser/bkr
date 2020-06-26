#!/bin/bash
bin_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
lib_path=$( cd $bin_path ; cd ../lib; pwd -P )
node --no-warnings --experimental-loader "${lib_path}/hyper-loader.js" ${bin_path}/bkr.js "$@"
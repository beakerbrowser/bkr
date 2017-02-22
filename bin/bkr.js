#!/usr/bin/env node

import subcommand from 'subcommand'
import chalk from 'chalk'
import semver from 'semver'

import initCmd from '../lib/commands/init'
import cloneCmd from '../lib/commands/clone'
import forkCmd from '../lib/commands/fork'
import statusCmd from '../lib/commands/status'
import openCmd from '../lib/commands/open'
import pullCmd from '../lib/commands/pull'
import publishCmd from '../lib/commands/publish'
import devCmd from '../lib/commands/dev'
import lsCmd from '../lib/commands/ls'
import saveCmd from '../lib/commands/save'
import unsaveCmd from '../lib/commands/unsave'

import usage from '../lib/usage'
import { getClient } from '../lib/client'

import packageJson from '../../package.json'

const BKR_VERSION = packageJson.version
const MIN_BEAKER_VERSION = '0.6.1'

// main
// =

var commands = [
  initCmd,
  cloneCmd,
  forkCmd,
  statusCmd,
  openCmd,
  pullCmd,
  publishCmd,
  devCmd,
  lsCmd,
  saveCmd,
  unsaveCmd
].map(wrapCommand)

// match & run the command
var match = subcommand({ commands, none })
match(process.argv.slice(2))

// adds a handshake before each command, and nice error output
function wrapCommand (obj) {
  var innerCommand = obj.command

  obj.command = async function (...args) {
    try {
      var beakerVersion = await getClient().hello(BKR_VERSION)
      if (!semver.valid(beakerVersion) || semver.lt(beakerVersion, MIN_BEAKER_VERSION)) {
        throw `Beaker version is ${beakerVersion} and minimum required is ${MIN_BEAKER_VERSION}. Please update your browser!`
      }
      await innerCommand(...args)
    } catch (err) {
      if (err.code === 'ECONNREFUSED') {
        out('Error: Could not connect to Beaker. Is it running?')
      } else {
        // generic output
        out(err)
      }
      process.exit(1)
    }
  }

  function out (...args) {
    console.error(chalk.bold.red(...args))  
  }
  return obj
}

// error output when no/invalid command is given
function none (args) {
  if (args.version) {
    console.log(packageJson.version)
    process.exit(0)
  }
  var err = (args._[0]) ? `Invalid command: ${args._[0]}` : false
  usage(err)
}
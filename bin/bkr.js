#!/usr/bin/env node

import subcommand from 'subcommand'
import chalk from 'chalk'

import initCmd from '../lib/commands/init'
import coCmd from '../lib/commands/co'
import forkCmd from '../lib/commands/fork'
import statusCmd from '../lib/commands/status'
import pullCmd from '../lib/commands/pull'
import publishCmd from '../lib/commands/publish'
import devCmd from '../lib/commands/dev'
import lsCmd from '../lib/commands/ls'
import addCmd from '../lib/commands/add'
import rmCmd from '../lib/commands/rm'
import hostCmd from '../lib/commands/host'
import unhostCmd from '../lib/commands/unhost'

import * as errorHandler from '../lib/error-handler'
import usage from '../lib/usage'

// main
// =

// wrap all commands with error handling
var commands = [
  initCmd,
  coCmd,
  forkCmd,
  statusCmd,
  pullCmd,
  publishCmd,
  devCmd,
  lsCmd,
  addCmd,
  rmCmd,
  hostCmd,
  unhostCmd
].map(errorHandler.wrapCommand)

// match & run the command
var defaults = [{ name: 'dir', default: process.cwd() }]
var match = subcommand({ commands, none, defaults })
match(process.argv.slice(2))

function none (args) {
  var err = (args._[0]) ? `Invalid command: ${args._[0]}` : false
  usage(err)
}
#!/usr/bin/env node

import subcommand from 'subcommand'
import fs from 'fs'
import chalk from 'chalk'

// import initCmd from '../lib/commands/init.js'
// import forkCmd from '../lib/commands/fork.js'
// import statusCmd from '../lib/commands/status.js'
// import lsCmd from '../lib/commands/ls.js'
// import saveCmd from '../lib/commands/save.js'
// import unsaveCmd from '../lib/commands/unsave.js'
import runCmd from '../lib/commands/run.js'

import usage from '../lib/usage.js'

// main
// =

var commands = [
  // initCmd,
  // forkCmd,
  // statusCmd,
  // lsCmd,
  // saveCmd,
  // unsaveCmd
  runCmd
].map(wrapCommand)

// match & run the command
var match = subcommand({ commands, none })
match(process.argv.slice(2))

// error output when no/invalid command is given
function none (args) {
  if (args.version) {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
    console.log(packageJson.version)
    process.exit(0)
  }
  var err = (args._[0]) ? `Invalid command: ${args._[0]}` : false
  usage(err)
}

function wrapCommand (obj) {
  var innerCommand = obj.command

  obj.command = async function (...args) {
    try {
      await innerCommand(...args)
    } catch (err) {
      usage(err)
      process.exit(1)
    }
  }
  return obj
}
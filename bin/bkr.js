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

var match = subcommand({
  commands: [
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
  ],
  none
})
match(process.argv.slice(2))


function none () {
  console.log(
`Usage: ${chalk.bold(`bkr`)} <command> ${chalk.gray(`[opts...]`)}

  ${chalk.bold(`init`)} ${chalk.gray(`[directory]`)}
  ${chalk.bold(`co`)} <dat-link> ${chalk.gray(`[directory]`)}
  ${chalk.bold(`fork`)} <dat-link|directory> ${chalk.gray(`[directory]`)}

  ${chalk.bold(`dev`)} ${chalk.gray(`[directory]`)}

  ${chalk.bold(`status`)} ${chalk.gray(`[directory]`)}
  ${chalk.bold(`pull`)} ${chalk.gray(`[--live] [directory]`)}
  ${chalk.bold(`publish`)} ${chalk.gray(`[major|minor|patch|{version}] [directory]`)}

  ${chalk.bold(`ls`)} ${chalk.gray(`[--mine]`)}
  ${chalk.bold(`add`)} <dat-link|dat-ref>
  ${chalk.bold(`rm`)} <dat-link|dat-ref>
  ${chalk.bold(`host`)} <dat-link|dat-ref>
  ${chalk.bold(`unhost`)} <dat-link|dat-ref>

  ${chalk.blue(`Learn more at https://github.com/beakerbrowser/bkr`)}
`)
}
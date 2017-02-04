import chalk from 'chalk'
import fs from 'fs-promise'
import path from 'path'
import inquirer from 'inquirer'
import username from 'username'
import { getClient } from '../client'
import { dirOpt } from '../opts'
import { isDirInitable } from '../working-dir'
import { trim } from '../strings'

export default {
  name: 'init',
  command: async function (args) {
    var rpc = getClient()
    var dir = dirOpt(args._[0])

    // check if the dir is valid
    await isDirInitable(dir)

    // ask user questions
    console.log(trim`
      Initializing ${dir}

      This utility will walk you through creating a dat.json file.
      It only covers the most common items, and tries to guess sensible defaults.
    `)
    const q = (name, message, def, type='input') => ({ name, message, 'default': def, type })
    var answers = await inquirer.prompt([
      q('title', 'title:', path.basename(dir)),
      q('description', 'description:'),
      q('author', 'author:', await username())
    ])
    console.log(`\nAbout to write ${path.join(dir, 'dat.json')}\n`)
    console.log(JSON.stringify(answers, null, 2), '\n')
    var confirm = await inquirer.prompt([{ type: 'confirm', name: 'ok', message: 'Is this ok?', default: true }])
    if (!confirm.ok) {
      console.log('Aborted.')
      process.exit(0)
    }

    // create site in beaker
    var datKey = await rpc.createNewArchive(answers)
    console.log(trim`
      Created new site
      ${chalk.gray(`dat://${datKey}/`)}
    `)

    // check out the site here
    await rpc.exportFileFromArchive(datKey, '/dat.json', path.join(dir, 'dat.json'))
  },
  options: []
}

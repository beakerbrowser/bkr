import chalk from 'chalk'
import fs from 'fs-promise'
import prettyHash from 'pretty-hash'
import path from 'path'
import mkdirp from 'mkdirp'
import { getClient } from '../client'
import { daturlOpt, dirOpt, daturlToKey } from '../opts'
import { isDirClean } from '../working-dir'
import { trim } from '../strings'

export default {
  name: 'co',
  command: async function (args) {
    var rpc = getClient()
    var daturl = daturlOpt(args._[0])
    var dir = dirOpt(args._[1])

    if (!daturl) {
      if (!args._[0]) throw new Error('Dat URL is required')
      else throw new Error(`'${args._[0]}' is not a valid dat url`)
    }

    // check if the dir is valid
    await isDirClean(dir)
    mkdirp.sync(dir)

    // export the site
    var datkey = daturlToKey(daturl)
    console.log(`\nChecking out ${chalk.gray('dat://' + prettyHash(datkey))} into ${chalk.bold(dir)}`)
    var res = await rpc.exportFileFromArchive(datkey, '/', dir)
    console.log(`${res.numFiles} files created\n`)
  },
  options: []
}

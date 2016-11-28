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
  name: 'fork',
  command: async function (args) {
    var rpc = getClient()
    var daturl = daturlOpt(args._[0])
    var dir = dirOpt(args._[1])

    if (!daturl) {
      if (!args._[0]) throw new Error('Dat URL is required')
      else throw new Error(`'${args._[0]}' is not a valid dat url`)
    }
    var datkey = daturlToKey(daturl)

    // check if the dir is valid
    await isDirClean(dir)
    mkdirp.sync(dir)

    // fork the original site
    console.log(`\nForking ${chalk.gray('dat://' + prettyHash(datkey))}, please be patient...\n`)
    var newdatkey = await rpc.forkArchive(datkey)

    // export the new site
    console.log(`Checking out into ${chalk.bold(dir)}`)
    var res = await rpc.exportFileFromArchive(newdatkey, '/', dir)
    console.log(`${res.numFiles} files created`)
    console.log(`New url: ${chalk.gray('dat://' + newdatkey)}\n`)
  },
  options: []
}

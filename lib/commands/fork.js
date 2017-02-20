import chalk from 'chalk'
import fs from 'fs-promise'
import prettyHash from 'pretty-hash'
import path from 'path'
import mkdirp from 'mkdirp'
import inquirer from 'inquirer'
import { getClient } from '../client'
import { daturlOpt, dirOpt, daturlToKey, isDatUrl } from '../opts'
import { isDirClean, getDatManifest } from '../working-dir'
import { trim } from '../strings'
import {downloadArchive} from '../subcommands'

export default {
  name: 'fork',
  command: async function (args) {
    var rpc = getClient()
    var daturl = await daturlOpt(args._[0])
    var dir = dirOpt(args._[1])
    var inplaceFork = false

    // check for inplace-fork
    // =
    if (!daturl) {
      // in-place fork in the given dir?
      if (!dir) dir = dirOpt(args._[0])
      var manifest = await getDatManifest(dir)
      if (isDatUrl(manifest.url)) {
        // make sure this is what the user wants
        var confirm = await inquirer.prompt([{ type: 'confirm', name: 'ok', message: `Fork the site at ${dir} ?`, default: false }])
        if (!confirm.ok) {
          console.log('Aborted.')
          process.exit(0)
        }

        // ok inplace forking
        inplaceFork = true
        daturl = manifest.url
      }

      // fail
      if (!daturl) {
        if (!args._[0]) throw new Error('Dat URL is required')
        else throw new Error(`'${args._[0]}' is not a valid dat url`)
      }
    }
    var datkey = daturlToKey(daturl)

    // check if the dir is valid
    // =
    if (!inplaceFork) {
      await isDirClean(dir)
      mkdirp.sync(dir)
    }

    // ensure the original is available
    // =
    await rpc.loadDat(datkey)    

    // unless the user asks for the cached version,
    // pull it from the network
    if (!args.cached) {
      await downloadArchive(rpc, datkey)
    }

    // fork the original site
    //=
    console.log(`\nForking ${chalk.gray('dat://' + prettyHash(datkey))}, please be patient...\n`)
    var newdatkey = await rpc.forkArchive(datkey)

    // output dir
    // =
    if (inplaceFork) {
      // update the dat.json
      await rpc.exportFileFromArchive(newdatkey, '/dat.json', path.join(dir, 'dat.json'))
      console.log(`New url: ${chalk.gray('dat://' + newdatkey)}\n`)
    } else {
      // export the new site
      console.log(`Checking out into ${chalk.bold(dir)}`)
      var res = await rpc.exportFileFromArchive(newdatkey, '/', dir)
      console.log(`${res.fileCount} files created`)
      console.log(`New url: ${chalk.gray('dat://' + newdatkey)}\n`)
    }
  },
  options: [
    {
      name: 'cached',
      boolean: true,
      default: false
    }
  ]
}

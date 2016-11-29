import chalk from 'chalk'
import prettyHash from 'pretty-hash'
import { getClient } from '../client'
import { dirOpt, daturlToKey } from '../opts'
import { getDatUrl } from '../working-dir'

export default {
  name: 'publish',
  command: async function (args) {
    var rpc = getClient()
    var newVersion = args._[0]
    var dir = dirOpt(args._[1])

    if (typeof version !== 'string') {
      throw new Error('A version is required.')
    }

    // get the directory's dat url
    var daturl = await getDatUrl(dir)
    var datkey = daturlToKey(daturl)

    // get the directory's version
    var currentVersion = await getDatVersion(dir)

    // export the site
    console.log(`\nPulling latest from ${chalk.gray('dat://' + prettyHash(datkey))} into ${chalk.bold(dir)}`)
    var res = await rpc.exportFileFromArchive(datkey, '/', dir)
    console.log(`${res.numFiles} files written\n`)
  },
  options: []
}

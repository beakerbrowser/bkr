import chalk from 'chalk'
import prettyHash from 'pretty-hash'
import { getClient } from '../client'
import { dirOpt, daturlToKey } from '../opts'
import { getDatUrl } from '../working-dir'

export default {
  name: 'pull',
  command: async function (args) {
    var rpc = getClient()
    var dir = dirOpt(args._[0])

    // get the directory's dat url
    var daturl = await getDatUrl(dir)

    // export the site
    var datkey = daturlToKey(daturl)
    console.log(`\nPulling latest from ${chalk.gray('dat://' + prettyHash(datkey))} into ${chalk.bold(dir)}`)
    var res = await rpc.exportFileFromArchive(datkey, '/', dir)
    console.log(`${res.numFiles} files written\n`)
  },
  options: []
}

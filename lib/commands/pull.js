import chalk from 'chalk'
import { getClient } from '../client'
import { dirOpt, daturlToKey } from '../opts'
import { getDatUrl } from '../working-dir'
import { niceUrl } from '../strings'

export default {
  name: 'pull',
  command: async function (args) {
    var rpc = getClient()
    var dir = dirOpt(args._[0])

    // get the directory's dat url
    var daturl = await getDatUrl(dir)
    var datkey = daturlToKey(daturl)

    // ensure the site is in beaker's active cache
    await rpc.loadDat(datkey)

    // export the site
    console.log(`\nPulling latest from ${niceUrl(daturl)} into ${chalk.bold(dir)}`)
    var res = await rpc.exportFileFromArchive(datkey, '/', dir)
    console.log(`${res.fileCount} files written\n`)
  },
  options: []
}

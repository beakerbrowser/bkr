import chalk from 'chalk'
import { getClient } from '../client'
import { dirOpt, daturlToKey } from '../opts'
import { getDatUrl } from '../working-dir'
import { niceUrl } from '../strings'

export default {
  name: 'open',
  command: async function (args) {
    var rpc = getClient()
    var dir = dirOpt(args._[0])

    // get the directory's dat url
    var daturl = await getDatUrl(dir)

    // call open
    await rpc.openUrl(daturl)
  },
  options: []
}

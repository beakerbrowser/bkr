import {getClient} from '../client'
import {dirOpt} from '../opts'
import {initArchive} from '../subcommands'

export default {
  name: 'init',
  command: async function (args) {
    var rpc = getClient()
    var dir = dirOpt(args._[0])
    await initArchive(rpc, dir)
  },
  options: []
}

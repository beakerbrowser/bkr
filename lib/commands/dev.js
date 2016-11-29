import chalk from 'chalk'
import memdb from 'memdb'
import Dat from 'dat-node'
import { getClient } from '../client'
import { dirOpt } from '../opts'
import { niceUrl } from '../strings'

export default {
  name: 'dev',
  command: async function (args) {
    var rpc = getClient()
    var dir = dirOpt(args._[0])

    // create dat-node share from memory
    var dat = Dat({
      dir,
      ignore: ['.dat', '.git', '**/.dat', '**/.git'],
      ignoreHidden: true,
      watchFiles: true,
      discovery: {upload: true, download: true},
      db: memdb()
    })
    console.log(`\n  Building '${dir}'...`)
    dat.share(err => {
      if (err) throw err
      console.log(`  Ready. Sharing at:\n`)
      console.log(`  ${chalk.bold('dat://' + dat.archive.key.toString('hex'))}`)
    })
  }
}

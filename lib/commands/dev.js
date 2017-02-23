import chalk from 'chalk'
import memdb from 'memdb'
import Dat from 'dat-node'
import { getClient } from '../client'
import { dirOpt } from '../opts'
import { niceUrl } from '../strings'
import { getDatIgnore } from '../working-dir'

export default {
  name: 'dev',
  command: async function (args) {
    var rpc = getClient()
    var dir = dirOpt(args._[0])

    // get the directory's ignore
    var ignore = await getDatIgnore(dir)

    Dat(dir, { db: memdb() }, (err, dat) => {
      if (err) throw err
      console.log(`\n  Building '${dir}'...`)

      dat.importFiles({
        ignore: ignore.concat(['.dat', '.git', '**/.dat', '**/.git']),
        ignoreHidden: true,
        watch: true
      }, err => {
        if (err) throw err

        var url = 'dat://' + dat.key.toString('hex')
        rpc.openUrl(url)
        console.log(`  Ready. Sharing at:\n`)
        console.log(`  ${chalk.bold(url)}`)
      })

      dat.joinNetwork({
        upload: true,
        download: true
      })
    })
  }
}

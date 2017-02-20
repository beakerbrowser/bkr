import chalk from 'chalk'
import { getClient } from '../client'
import { dirOpt, daturlToKey, isDatUrl } from '../opts'
import { getDatManifest, writeDatManifest, getDatIgnore } from '../working-dir'
import { niceUrl, trim } from '../strings'
import { statusDiff } from '../output'

export default {
  name: 'status',
  command: async function (args) {
    var rpc = getClient()
    var dir = dirOpt(args._[0])

    // get the directory's ignore
    var ignore = await getDatIgnore(dir)

    // get the directory's dat manifest
    var manifest = await getDatManifest(dir)
    if (!isDatUrl(manifest.url)) throw new Error(`Destination path '${dir}' does not have a valid url field in its dat.json, aborting`)
    var daturl = manifest.url
    var datkey = daturlToKey(daturl)

    // ensure the site is in beaker's active cache
    await rpc.loadDat(datkey)

    // run a dry-run publish
    var datkey = daturlToKey(daturl)
    console.log(`Running a diff...\n${daturl}`)
    var res = await rpc.writeArchiveFileFromPath(datkey, { src: dir, dst: '/', ignore, inplaceImport: true, dryRun: true })

    // report results
    statusDiff(res)
  },
  options: []
}

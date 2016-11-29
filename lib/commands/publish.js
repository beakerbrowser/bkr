import chalk from 'chalk'
import prettyBytes from 'pretty-bytes'
import semver from 'semver'
import { getClient } from '../client'
import { dirOpt, daturlToKey, isDatUrl } from '../opts'
import { getDatManifest, writeDatManifest } from '../working-dir'
import { niceUrl } from '../strings'

export default {
  name: 'publish',
  command: async function (args) {
    var rpc = getClient()
    var newVersion = args._[0]
    var dir = dirOpt(args._[1])

    if (typeof newVersion !== 'string') {
      throw new Error('A version is required.')
    }

    // get the directory's dat manifest
    var manifest = await getDatManifest(dir)
    if (!isDatUrl(manifest.url)) throw new Error(`Destination path '${dir}' does not have a valid url field in its dat.json, aborting`)

    var daturl = manifest.url
    var datkey = daturlToKey(daturl)

    var currentVersion = manifest.version
    if (typeof currentVersion === 'number') currentVersion = ''+currentVersion
    if (typeof currentVersion !== 'string') currentVersion = '0.0.0'

    // update the version
    if (['patch','minor','major'].includes(newVersion)) {
      if (!semver.valid(currentVersion)) throw new Error(`Cannot bump the current version, '${currentVersion}'. Not a valid semver.`)
      newVersion = semver.inc(currentVersion, newVersion)
    }
    manifest.version = newVersion
    await writeDatManifest(dir, manifest)

    // publish
    var datkey = daturlToKey(daturl)
    console.log(`\nPublishing ${newVersion} of ${niceUrl(daturl)}`)
    var res = await rpc.writeArchiveFileFromPath(datkey, { src: dir, dst: '/', inplaceImport: true })
    console.log(`${res.fileCount} files (${prettyBytes(res.totalSize)})\n`)
  },
  options: []
}

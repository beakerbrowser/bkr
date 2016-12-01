import chalk from 'chalk'
import prettyBytes from 'pretty-bytes'
import semver from 'semver'
import inquirer from 'inquirer'
import { getClient } from '../client'
import { dirOpt, daturlToKey, isDatUrl } from '../opts'
import { getDatManifest, writeDatManifest } from '../working-dir'
import { niceUrl, trim } from '../strings'

export default {
  name: 'publish',
  command: async function (args) {
    var rpc = getClient()
    var newVersion = args._[0]
    var dir = dirOpt(args._[1])

    // get the directory's dat manifest
    var manifest = await getDatManifest(dir)
    if (!isDatUrl(manifest.url)) throw new Error(`Destination path '${dir}' does not have a valid url field in its dat.json, aborting`)

    var daturl = manifest.url
    var datkey = daturlToKey(daturl)

    var currentVersion = manifest.version
    if (typeof currentVersion === 'number') currentVersion = ''+currentVersion
    if (typeof currentVersion !== 'string') currentVersion = '0.0.0'

    // update the version
    if (newVersion) {
      if (['patch','minor','major'].includes(newVersion)) {
        if (!semver.valid(currentVersion)) throw new Error(`Cannot bump the current version, '${currentVersion}'. Not a valid semver.`)
        newVersion = semver.inc(currentVersion, newVersion)
      }
      manifest.version = newVersion
      await writeDatManifest(dir, manifest)
    } else {
      newVersion = currentVersion
    }

    // publish
    console.log(`\nPublishing ${newVersion} of ${niceUrl(daturl)}`)
    var confirm = await inquirer.prompt([{ type: 'confirm', name: 'ok', message: 'Is this ok?', default: true }])
    if (!confirm.ok) {
      console.log('Aborted.')
      process.exit(0)
    }
    var res = await rpc.writeArchiveFileFromPath(datkey, { src: dir, dst: '/', inplaceImport: true })
    console.log(trim`
      ${res.fileCount} files (${prettyBytes(res.totalSize)})
      ${res.addedFiles.length} added, ${res.updatedFiles.length} updated
    `)
  },
  options: []
}

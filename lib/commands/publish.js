import chalk from 'chalk'
import prettyBytes from 'pretty-bytes'
import semver from 'semver'
import inquirer from 'inquirer'
import { getClient } from '../client'
import { dirOpt, daturlToKey, isDatUrl } from '../opts'
import { getDatManifest, writeDatManifest, getDatIgnore } from '../working-dir'
import { niceUrl, trim } from '../strings'
import { statusDiff } from '../output'

export default {
  name: 'publish',
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

    // run a dry-run publish
    console.log(`Running a diff...\n${daturl}`)
    var res = await rpc.writeArchiveFileFromPath(datkey, { src: dir, dst: '/', ignore, inplaceImport: true, dryRun: true })

    // report results
    statusDiff(res)
    if (res.addedFiles.length === 0 && res.updatedFiles.length === 0) {
      process.exit(0) // stop if there's nothing to publish
    }

    // prompt to publish
    console.log(`Publishing ${niceUrl(daturl)}`)
    var confirm = await inquirer.prompt([{ type: 'confirm', name: 'ok', message: 'Publish?', default: false }])
    if (!confirm.ok) {
      console.log('Aborted.')
      process.exit(0)
    }

    // publish
    var res = await rpc.writeArchiveFileFromPath(datkey, { src: dir, dst: '/', ignore, inplaceImport: true })
    console.log(trim`
      ${res.fileCount} files (${prettyBytes(res.totalSize)})
      ${res.addedFiles.length} added, ${res.updatedFiles.length} updated
    `)
  },
  options: []
}

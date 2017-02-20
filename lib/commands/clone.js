import chalk from 'chalk'
import fs from 'fs-promise'
import prettyHash from 'pretty-hash'
import prettyBytes from 'pretty-bytes'
import mkdirp from 'mkdirp'
import {getClient} from '../client'
import {daturlOpt, dirOpt, daturlToKey} from '../opts'
import {isDirClean, getDatManifest, writeDatManifest} from '../working-dir'
import {trim, normalizeUrl} from '../strings'
import {downloadArchive} from '../subcommands'

export default {
  name: 'clone',
  command: async function (args) {
    var rpc = getClient()
    var daturl = await daturlOpt(args._[0])
    var dir = dirOpt(args._[1])

    if (!daturl) {
      if (!args._[0]) throw new Error('Dat URL is required')
      else throw new Error(`'${args._[0]}' is not a valid dat url`)
    }
    var datkey = daturlToKey(daturl)

    // check if the dir is valid
    await isDirClean(dir)
    mkdirp.sync(dir)

    // ensure the site is in beaker's active cache
    // (this will start the meta download automatically)
    await rpc.loadDat(datkey)

    // unless the user asks for the cached version,
    // pull it from the network
    if (!args.cached) {
      await downloadArchive(rpc, datkey)
    }

    // export the site
    console.log(`\nChecking out ${chalk.gray('dat://' + prettyHash(datkey))} into ${chalk.bold(dir)}`)
    var res = await rpc.exportFileFromArchive(datkey, '/', dir)

    // make sure the manifest is in good shape
    var manifest, shouldWriteManifest = false
    try {
      manifest = await getDatManifest(dir)
    } catch (e) {
      // the manifest needs to be created
      console.log(`dat.json not found, generating one from what is known about the site.`)
      manifest = { url: daturl }
      shouldWriteManifest = true
    }
    if (normalizeUrl(manifest.url) !== normalizeUrl(daturl)) {
      // the url field needs to be set
      manifest.url = daturl
      console.log(`dat.json url field is incorrect, updating.`)
      shouldWriteManifest = true
    }
    if(shouldWriteManifest) {
      await writeDatManifest(dir, manifest)
    }

    // done
    console.log(`${res.fileCount} files (${prettyBytes(res.totalSize)}) created\n`)
  },
  options: [
    {
      name: 'cached',
      boolean: true,
      default: false
    }
  ]
}

import chalk from 'chalk'
import fs from 'fs-promise'
import prettyHash from 'pretty-hash'
import path from 'path'
import mkdirp from 'mkdirp'
import { getClient } from '../client'
import { daturlOpt, dirOpt, daturlToKey } from '../opts'
import { isDirClean, getDatManifest, writeDatManifest } from '../working-dir'
import { trim, normalizeUrl } from '../strings'

export default {
  name: 'co',
  command: async function (args) {
    var rpc = getClient()
    var daturl = daturlOpt(args._[0])
    var dir = dirOpt(args._[1])

    if (!daturl) {
      if (!args._[0]) throw new Error('Dat URL is required')
      else throw new Error(`'${args._[0]}' is not a valid dat url`)
    }

    // check if the dir is valid
    await isDirClean(dir)
    mkdirp.sync(dir)

    // export the site
    var datkey = daturlToKey(daturl)
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
    console.log(`${res.numFiles} files created\n`)
  },
  options: []
}

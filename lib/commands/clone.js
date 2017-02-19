import chalk from 'chalk'
import fs from 'fs-promise'
import prettyHash from 'pretty-hash'
import path from 'path'
import mkdirp from 'mkdirp'
import progressString from 'progress-string'
import statusLogger from 'status-logger'
import { getClient } from '../client'
import { daturlOpt, dirOpt, daturlToKey } from '../opts'
import { isDirClean, getDatManifest, writeDatManifest } from '../working-dir'
import { trim, normalizeUrl } from '../strings'

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

    // unless the user asks for the cached version,
    // pull it from the network
    if (!args.cached) {
      // add the site to beaker's active cache
      // (this will start the meta download automatically)
      await rpc.loadDat(datkey)

      // initialize rendering
      let bar = progressString({
        width: 50,
        total: 100,
        style: function (complete, incomplete) {
          return '[' + complete + '>' + incomplete + ']'
        }
      })
      let output = [
        'Starting Clone...', // Status line
        '', // Peers
        '', // Meta progress
        '', // Content progress
      ]
      let statusLog = statusLogger(output)

      let isFirstPrint = true
      let isDownloadingContent = false
      while (true) {
        // fetch current state
        let stats = await rpc.getArchiveStats(datkey)
        let metaDownloaded = stats.meta.blocksRemaining === 0
        let contentDownloaded = stats.content.blocksRemaining === 0

        // render progress
        output[0] = (!metaDownloaded)
          ? 'Downloading metadata...'
          : 'Downloading content...'
        output[1] = `${stats.peers} peers`
        output[2] = `Metadata: ${bar(pct(stats.meta))}`
        output[3] = `Content:  ${bar(pct(stats.content))}`
        if (isFirstPrint) {
          console.log('') // add some space
          isFirstPrint = false
        }
        statusLog.print()

        // done?
        if (metaDownloaded && contentDownloaded) {
          break
        }

        // download content
        if (metaDownloaded && !isDownloadingContent) {
          // meta is downloaded, trigger content download
          rpc.downloadArchive(datkey)
          isDownloadingContent = true
        }

        await sleep(500)
      }
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
    console.log(`${res.numFiles} files created\n`)
  },
  options: [
    {
      name: 'cached',
      boolean: true,
      default: false
    }
  ]
}

function sleep (time) {
  return new Promise(resolve => setTimeout(resolve, time))
}

function pct (stat) {
  return (stat.blocksTotal - stat.blocksRemaining) / stat.blocksTotal * 100
}

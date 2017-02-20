import chalk from 'chalk'
import prettyBytes from 'pretty-bytes'
import prettyHash from 'pretty-hash'
import semver from 'semver'
import inquirer from 'inquirer'
import {getClient} from '../client'
import {dirOpt, daturlToKey, isDatUrl} from '../opts'
import {getDatManifest, writeDatManifest, getDatIgnore} from '../working-dir'
import {niceUrl, trim} from '../strings'
import {statusDiff} from '../output'
import {initArchive} from '../subcommands'

export default {
  name: 'publish',
  command: async function (args) {
    var rpc = getClient()
    var dir = dirOpt(args._[0])
    var isNew = false

    // get the directory's ignore
    var ignore = await getDatIgnore(dir)

    // get the directory's dat manifest
    var manifest
    try {
      manifest = await getDatManifest(dir)
      if (!isDatUrl(manifest.url)) {
        throw new Error()
      }
    } catch (e) {
      // run init if no manifest exists
      await initArchive(rpc, dir)
      manifest = await getDatManifest(dir)
      isNew = true
    }

    var daturl = manifest.url
    var datkey = daturlToKey(daturl)

    // run a dry-run publish
    if (!isNew) {
      console.log(`Running a diff...\n${daturl}`)
    }
    var res = await rpc.writeArchiveFileFromPath(datkey, { src: dir, dst: '/', ignore, inplaceImport: true, dryRun: true })

    // report results
    statusDiff(res)
    if (res.addedFiles.length === 0 && res.updatedFiles.length === 0) {
      process.exit(0) // stop if there's nothing to publish
    }

    // prompt to publish
    console.log(`Publishing ${niceUrl(daturl)}`)
    var confirm = await inquirer.prompt([{ type: 'confirm', name: 'ok', message: 'Publish?', default: true }])
    if (!confirm.ok) {
      console.log('Aborted.')
      process.exit(0)
    }

    try {
      // publish
      var res = await rpc.writeArchiveFileFromPath(datkey, { src: dir, dst: '/', ignore, inplaceImport: true })
      console.log(trim`
        ${res.fileCount} files (${prettyBytes(res.totalSize)})
        ${res.addedFiles.length} added, ${res.updatedFiles.length} updated
      `)
    } catch (err) {
      if (err.indexOf('not the archive owner') === -1) {
        throw err
      }

      // prompt to fork
      var confirm = await inquirer.prompt([{ type: 'confirm', name: 'ok', message: `You dont own this archive. Would you like to fork it?`, default: false }])
      if (!confirm.ok) {
        console.log('Aborted.')
        process.exit(0)
      }

      // fork
      console.log(`\nForking ${chalk.gray('dat://' + prettyHash(datkey))}, please be patient...\n`)
      var newdatkey = await rpc.forkArchive(datkey)

      // update the dat.json
      manifest.url = `dat://${newdatkey}/`
      await writeDatManifest(dir, manifest)

      // publish
      var res = await rpc.writeArchiveFileFromPath(newdatkey, { src: dir, dst: '/', ignore, inplaceImport: true })
      console.log(trim`
        New url: ${chalk.gray('dat://' + newdatkey)}
        ${res.fileCount} files (${prettyBytes(res.totalSize)})
        ${res.addedFiles.length} added, ${res.updatedFiles.length} updated
      `)
    }
  },
  options: []
}

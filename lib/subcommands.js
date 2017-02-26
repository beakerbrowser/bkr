import progressString from 'progress-string'
import statusLogger from 'status-logger'
import prettyBytes from 'pretty-bytes'
import chalk from 'chalk'
import path from 'path'
import inquirer from 'inquirer'
import username from 'username'
import {isDirInitable} from './working-dir'
import {trim} from './strings'

export async function initArchive(rpc, dir) {
  // check if the dir is valid
  await isDirInitable(dir)

  // ask user questions
  console.log(trim`
    Initializing ${dir}

    This utility will walk you through creating a dat.json file.
    It only covers the most common items, and tries to guess sensible defaults.
  `)
  const q = (name, message, def, type='input') => ({ name, message, 'default': def, type })
  var answers = await inquirer.prompt([
    q('title', 'title:', path.basename(dir)),
    q('description', 'description:'),
    q('author', 'author:', await username())
  ])
  console.log(`\nAbout to write ${path.join(dir, 'dat.json')}\n`)
  console.log(JSON.stringify(answers, null, 2), '\n')
  var confirm = await inquirer.prompt([{ type: 'confirm', name: 'ok', message: 'Is this ok?', default: true }])
  if (!confirm.ok) {
    console.log('Aborted.')
    process.exit(0)
  }

  // create site in beaker
  var datKey = await rpc.createNewArchive(answers)
  console.log(trim`
    Created new site
    dat://${datKey}/
  `)

  // check out the site here
  await rpc.exportFileFromArchive(datKey, '/dat.json', path.join(dir, 'dat.json'))
}

export async function downloadArchive(rpc, datkey) {
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
    let {peers, stats} = await rpc.getArchiveInfo(datkey, {stats: true})
    let metaDownloaded = stats.meta.blocksProgress === stats.meta.blocksTotal
    let contentDownloaded = stats.content.blocksProgress === stats.content.blocksTotal

    // render progress
    output[0] = (!metaDownloaded)
      ? 'Downloading metadata...'
      : `Downloading content (${prettyBytes(stats.content.bytesTotal)})...`
    output[1] = `${peers} peers`
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


function sleep (time) {
  return new Promise(resolve => setTimeout(resolve, time))
}

function pct (stat) {
  return stat.blocksProgress / stat.blocksTotal * 100
}
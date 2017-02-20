import progressString from 'progress-string'
import statusLogger from 'status-logger'
import prettyBytes from 'pretty-bytes'

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
    let stats = await rpc.getArchiveStats(datkey)
    let metaDownloaded = stats.meta.blocksProgress === stats.meta.blocksTotal
    let contentDownloaded = stats.content.blocksProgress === stats.content.blocksTotal

    // render progress
    output[0] = (!metaDownloaded)
      ? 'Downloading metadata...'
      : `Downloading content (${prettyBytes(stats.content.bytesTotal)})...`
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


function sleep (time) {
  return new Promise(resolve => setTimeout(resolve, time))
}

function pct (stat) {
  return stat.blocksProgress / stat.blocksTotal * 100
}
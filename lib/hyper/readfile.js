import hyperdrive from 'hyperdrive'
import { createClient } from './index.js'
import { urlToKey, parseHyperUrl } from '../urls.js'

var hyperClient
var activeDrives = {}

export async function readFile (url, opts) {
  if (!hyperClient) {
    hyperClient = await createClient()
  }
  var urlp = parseHyperUrl(url)
  var drive = await getOrLoadDrive(urlp.hostname)
  return drive.promises.readFile(urlp.pathname, opts)
}

async function loadDrive (url) {
  const key = urlToKey(url)
  const drive = hyperdrive(hyperClient.corestore, key, {sparse: true, extension: false})
  await drive.promises.ready()
  await hyperClient.network.configure(drive.discoveryKey, { announce: true, lookup: true, flush: true })
  return drive
}

async function getOrLoadDrive (url) {
  if (activeDrives[url]) return activeDrives[url]
  activeDrives[url] = /* dont await */ loadDrive(url)
  return activeDrives[url]
}
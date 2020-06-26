import hyperdrive from 'hyperdrive'

// globals
// =

var activeDrives = {} // {[ur]: Promise<Hyperdrive>}

// exported api
// =

export function createHyperdrive ({scriptUrl, hyperClient}) {
  return {
    async readFile (url, opts) {
      var urlp = new URL(url)
      var drive = await getOrLoadDrive(hyperClient, 'hyper://' + urlp.hostname)
      return drive.promises.readFile(urlp.pathname, opts)
    }
  }
}

// internal methods
// =

async function createDrive (hyperClient) {
  const drive = hyperdrive(hyperClient.corestore, null, {sparse: true, extension: false})
  await drive.promises.ready()
  await hyperClient.network.configure(drive.discoveryKey, { announce: true, lookup: true, flush: true })
  return drive
}

async function loadDrive (hyperClient, url) {
  const key = urlToKey(url)
  const drive = hyperdrive(hyperClient.corestore, key, {sparse: true, extension: false})
  await drive.promises.ready()
  await hyperClient.network.configure(drive.discoveryKey, { announce: true, lookup: true, flush: true })
  return drive
}

async function getOrLoadDrive (hyperClient, url) {
  if (activeDrives[url]) return activeDrives[url]
  activeDrives[url] = /* dont await */ loadDrive(hyperClient, url)
  return activeDrives[url]
}

function urlToKey (url) {
  return Buffer.from(/([0-9a-f]{64})/i.exec(url)[1], 'hex')
}
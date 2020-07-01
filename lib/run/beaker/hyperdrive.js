import hyperdrive from 'hyperdrive'
import pda from 'pauls-dat-api2'
import { parseHyperUrl, urlToKey } from '../../urls.js'

const isHyperUrlRe = /^(hyper:\/\/)?[^\/]+/i

// globals
// =

var activeDrives = {} // {[ur]: Promise<Hyperdrive>}

// exported api
// =

export function createHyperdrive ({scriptUrl, hyperClient}) {
  var scriptOrigin = undefined
  if (scriptUrl.startsWith('hyper://')) {
    let scriptUrlp = new URL(scriptUrl)
    scriptOrigin = `hyper://` + scriptUrlp.hostname
  }

  return Object.assign(createBaseApi(hyperClient, scriptOrigin), {
    drive (url) {
      return createDriveApi(hyperClient, url)
    },

    async createDrive (opts) {
      let drive = await createDrive(hyperClient)
      await pda.writeManifest(drive, opts)
      return createDriveApi(hyperClient, `hyper://${drive.key.toString('hex')}/`)
    },

    forkDrive (url, opts) {
      throw new Error('TODO')
    },

    async getInfo (url, opts) {
      throw new Error('TODO')
    },

    async configure (url, info, opts) {
      throw new Error('TODO')
    }
  })
}

// internal methods
// =

async function createDrive (hyperClient) {
  const drive = hyperdrive(hyperClient.corestore, null, {sparse: true, extension: false})
  await drive.promises.ready()
  await hyperClient.network.configure(drive.discoveryKey, { announce: true, lookup: true, flush: true })
  activeDrives[`hyper://${drive.key.toString('hex')}/`] = drive
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
  url = toOrigin(url)
  if (activeDrives[url]) return activeDrives[url]
  activeDrives[url] = /* dont await */ loadDrive(hyperClient, url)
  return activeDrives[url]
}

function toOrigin (url) {
  let urlp = new URL(url)
  return `hyper://` + urlp.hostname + '/'
}

function createDriveApi (hyperClient, url) {
  const urlParsed = massageParseUrl(url)
  url = 'hyper://' + urlParsed.hostname + (urlParsed.version ? `+${urlParsed.version}` : '') + '/'

  return Object.assign(createBaseApi(hyperClient, null, url), {
    get url () { return url },
    get version () { return urlParsed.version },

    async getInfo (opts) {
      // return hyperdriveRPC.getInfo(url, opts)
      throw new Error('TODO') // TODO
    },

    async configure (info, opts) {
      // return hyperdriveRPC.configure(url, info, opts)
      throw new Error('TODO') // TODO
    },

    checkout (version) {
      version = version ? `+${version}` : ''
      return createDriveApi(hyperClient, `hyper://${urlParsed.hostname}${version}/`)
    },

    watch (pathSpec = null, onChanged = null) {
      // usage: (onChanged)
      if (typeof pathSpec === 'function') {
        onChanged = pathSpec
        pathSpec = null
      }
      // var evts = fromEventStream(hyperdriveRPC.watch(url, pathSpec))
      throw new Error('TODO')
      if (onChanged) {
        evts.addEventListener('changed', onChanged)
      }
      return evts
    }
  })
}

function createBaseApi (hyperClient, scriptOrigin, driveUrl = undefined) {
  const getUrlAndPath = (url) => {
    if (driveUrl) return {driveUrl, path: url}
    let urlp = massageParseUrl(scriptOrigin, url)
    return {driveUrl: urlp.origin, path: urlp.pathname}
  }

  return {
    async diff (url, other, opts) {
      throw new Error('TODO')
      // url = massageUrl(url)
      // other = other && typeof other === 'object' && other.version ? other.version : other
      // return hyperdriveRPC.diff(url, other, opts)
    },

    async stat (url, opts) {
      var {driveUrl, path} = getUrlAndPath(url)
      var drive = await getOrLoadDrive(hyperClient, driveUrl)
      return pda.stat(drive, path, opts)
    },

    async readFile (url, opts) {
      var {driveUrl, path} = getUrlAndPath(url)
      var drive = await getOrLoadDrive(hyperClient, driveUrl)
      return pda.readFile(drive, path, opts)
    },

    async writeFile (url, data, opts) {
      var {driveUrl, path} = getUrlAndPath(url)
      var drive = await getOrLoadDrive(hyperClient, driveUrl)
      return pda.writeFile(drive, path, data, opts)
    },

    async unlink (url, opts) {
      var {driveUrl, path} = getUrlAndPath(url)
      var drive = await getOrLoadDrive(hyperClient, driveUrl)
      return pda.unlink(drive, path, opts)
    },

    async copy (url, dstPath, opts) {
      var {driveUrl, path} = getUrlAndPath(url)
      var drive = await getOrLoadDrive(hyperClient, driveUrl)
      return pda.copy(drive, path, dstPath, opts)
    },

    async rename (url, dstPath, opts) {
      var {driveUrl, path} = getUrlAndPath(url)
      var drive = await getOrLoadDrive(hyperClient, driveUrl)
      return pda.rename(drive, path, dstPath, opts)
    },

    async updateMetadata (url, metadata, opts) {
      var {driveUrl, path} = getUrlAndPath(url)
      var drive = await getOrLoadDrive(hyperClient, driveUrl)
      return pda.updateMetadata(drive, path, metadata, opts)
    },

    async deleteMetadata (url, keys, opts) {
      var {driveUrl, path} = getUrlAndPath(url)
      var drive = await getOrLoadDrive(hyperClient, driveUrl)
      return pda.deleteMetadata(drive, path, keys, opts)
    },

    async readdir (url, opts) {
      var {driveUrl, path} = getUrlAndPath(url)
      var drive = await getOrLoadDrive(hyperClient, driveUrl)
      return pda.readdir(drive, path, opts)
    },

    async mkdir (url, opts) {
      var {driveUrl, path} = getUrlAndPath(url)
      var drive = await getOrLoadDrive(hyperClient, driveUrl)
      return pda.mkdir(drive, path, opts)
    },

    async rmdir (url, opts) {
      var {driveUrl, path} = getUrlAndPath(url)
      var drive = await getOrLoadDrive(hyperClient, driveUrl)
      return pda.rmdir(drive, path, opts)
    },

    async symlink (url, linkname, opts) {
      var {driveUrl, path} = getUrlAndPath(url)
      var drive = await getOrLoadDrive(hyperClient, driveUrl)
      return pda.symlink(drive, path, linkname, opts)
    },

    async mount (url, opts) {
      var {driveUrl, path} = getUrlAndPath(url)
      var drive = await getOrLoadDrive(hyperClient, driveUrl)
      if (opts.url) opts = opts.url
      return pda.mount(drive, path, opts)
    },

    async unmount (url, opts) {
      var {driveUrl, path} = getUrlAndPath(url)
      var drive = await getOrLoadDrive(hyperClient, driveUrl)
      return pda.unmount(drive, path, opts)
    },

    async query (opts) {
      if (typeof opts === 'string') {
        opts = {path: [opts]}
      }
      if (!opts.drive && location.protocol === 'hyper:') {
        opts.drive = [location.hostname]
      }
      throw new Error('TODO') // TODO
      // return hyperdriveRPC.query(opts)
    }
  }
}

function massageUrl (scriptOrigin, url) {
  if (!url) url = '/'
  if (typeof url !== 'string') {
    if (typeof url.url === 'string') {
      // passed in another drive instance
      url = url.url
    } else if (typeof url.href === 'string') {
      // passed in window.location
      url = url.href
    } else {
      throw new Error('Invalid hyper:// URL')
    }
  }
  if (scriptOrigin) {
    if (!isHyperUrlRe.test(url)) {
      url = joinPath(scriptOrigin, url)
    }
  } else if (!url.startsWith('hyper://')) {
    // didnt include the scheme
    url = 'hyper://' + url
  }
  if (!isHyperUrlRe.test(url)) {
    // whoops not a valid hyper:// url
    throw new Error('Invalid URL: must be a hyper:// URL')
  }
  return url
}

function joinPath (a = '', b = '') {
  ;[a, b] = [String(a), String(b)]
  var [aSlash, bSlash] = [a.endsWith('/'), b.startsWith('/')]
  if (!aSlash && !bSlash) return a + '/' + b
  if (aSlash && bSlash) return a + b.slice(1)
  return a + b
}

function massageParseUrl (scriptOrigin, url) {
  return parseHyperUrl(massageUrl(scriptOrigin, url))
}

function isNotUrlish (v) {
  if (!v) return true
  if (typeof v === 'string') return false
  if (typeof v === 'object') {
    if (typeof v.url === 'string') return false
    if (typeof v.href === 'string') return false
  }
  return true
}


import hyperdrive from 'hyperdrive'
import pda from 'pauls-dat-api2'
import { parseDriveUrl } from '../../urls.js'

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

  return {
    drive (url) {
      return createDriveApi(hyperClient, url)
    },

    createDrive (opts) {
      throw new Error('TODO')
    },

    forkDrive (url, opts) {
      throw new Error('TODO')
    },

    async getInfo (url, opts) {
      throw new Error('TODO')
    },

    async configure (url, info, opts) {
      throw new Error('TODO')
    },

    checkout (url, version) {
      if (isNotUrlish(url) && !version) {
        version = url
        url = ''
      }
      url = massageUrl(url)
      const urlParsed = parseDriveUrl(url)
      version = version ? `+${version}` : ''
      return createDriveApi(hyperClient, `hyper://${urlParsed.hostname}${version}/`)
    },

    async diff (url, other, opts) {
      throw new Error('TODO')
      // url = massageUrl(url)
      // other = other && typeof other === 'object' && other.version ? other.version : other
      // return hyperdriveRPC.diff(url, other, opts)
    },

    async stat (url, opts) {
      var urlp = massageParseUrl(scriptOrigin, url)
      var drive = await getOrLoadDrive(hyperClient, urlp.origin)
      return pda.stat(drive, urlp.pathname, opts)
    },

    async readFile (url, opts) {
      var urlp = massageParseUrl(scriptOrigin, url)
      var drive = await getOrLoadDrive(hyperClient, urlp.origin)
      return pda.readFile(drive, urlp.pathname, opts)
    },

    async writeFile (url, data, opts) {
      var urlp = massageParseUrl(scriptOrigin, url)
      var drive = await getOrLoadDrive(hyperClient, urlp.origin)
      return pda.writeFile(drive, urlp.pathname, data, opts)
    },

    async unlink (url, opts) {
      var urlp = massageParseUrl(scriptOrigin, url)
      var drive = await getOrLoadDrive(hyperClient, urlp.origin)
      return pda.unlink(drive, urlp.pathname, opts)
    },

    async copy (url, dstPath, opts) {
      var urlp = massageParseUrl(scriptOrigin, url)
      var drive = await getOrLoadDrive(hyperClient, urlp.origin)
      return pda.copy(drive, urlp.pathname, dstPath, opts)
    },

    async rename (url, dstPath, opts) {
      var urlp = massageParseUrl(scriptOrigin, url)
      var drive = await getOrLoadDrive(hyperClient, urlp.origin)
      return pda.rename(drive, urlp.pathname, dstPath, opts)
    },

    async updateMetadata (url, metadata, opts) {
      var urlp = massageParseUrl(scriptOrigin, url)
      var drive = await getOrLoadDrive(hyperClient, urlp.origin)
      return pda.updateMetadata(drive, urlp.pathname, metadata, opts)
    },

    async deleteMetadata (url, keys, opts) {
      var urlp = massageParseUrl(scriptOrigin, url)
      var drive = await getOrLoadDrive(hyperClient, urlp.origin)
      return pda.deleteMetadata(drive, urlp.pathname, keys, opts)
    },

    async readdir (url, opts) {
      var urlp = massageParseUrl(scriptOrigin, url)
      var drive = await getOrLoadDrive(hyperClient, urlp.origin)
      return pda.readdir(drive, urlp.pathname, opts)
    },

    async mkdir (url, opts) {
      var urlp = massageParseUrl(scriptOrigin, url)
      var drive = await getOrLoadDrive(hyperClient, urlp.origin)
      return pda.mkdir(drive, urlp.pathname, opts)
    },

    async rmdir (url, opts) {
      var urlp = massageParseUrl(scriptOrigin, url)
      var drive = await getOrLoadDrive(hyperClient, urlp.origin)
      return pda.rmdir(drive, urlp.pathname, opts)
    },

    async symlink (url, linkname, opts) {
      var urlp = massageParseUrl(scriptOrigin, url)
      var drive = await getOrLoadDrive(hyperClient, urlp.origin)
      return pda.symlink(drive, urlp.pathname, linkname, opts)
    },

    async mount (url, opts) {
      var urlp = massageParseUrl(scriptOrigin, url)
      var drive = await getOrLoadDrive(hyperClient, urlp.origin)
      if (opts.url) opts = opts.url
      return pda.mount(drive, urlp.pathname, opts)
    },

    async unmount (url, opts) {
      var urlp = massageParseUrl(scriptOrigin, url)
      var drive = await getOrLoadDrive(hyperClient, urlp.origin)
      return pda.unmount(drive, urlp.pathname, opts)
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

// internal methods
// =

async function createDrive (hyperClient) {
  const drive = hyperdrive(hyperClient.corestore, null, {sparse: true, extension: false})
  await drive.promises.ready()
  await hyperClient.network.configure(drive.discoveryKey, { announce: true, lookup: true, flush: true })
  return drive
}

async function loadDrive (hyperClient, url) {
  console.log('loading drive', url)
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

function toOrigin (url) {
  let urlp = new URL(url)
  return `hyper://` + urlp.hostname + '/'
}

function createDriveApi (hyperClient, url) {
  console.log(url)
  const urlParsed = massageParseUrl(url)
  console.log(urlParsed)
  url = 'hyper://' + urlParsed.hostname + (urlParsed.version ? `+${urlParsed.version}` : '') + '/'

  return {
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

    async diff (prefix, other, opts) {
      throw new Error('TODO') // TODO
      // other = other && typeof other === 'object' && other.version ? other.version : other
      // return hyperdriveRPC.diff(joinPath(url, prefix), other, prefix, opts)
    },

    async stat (path, opts) {
      var drive = await getOrLoadDrive(hyperClient, url)
      return pda.stat(drive, path, opts)
    },

    async readFile (path, opts) {
      var drive = await getOrLoadDrive(hyperClient, url)
      return pda.readFile(drive, path, opts)
    },

    async writeFile (path, data, opts) {
      var drive = await getOrLoadDrive(hyperClient, url)
      return pda.writeFile(drive, path, opts)
    },

    async unlink (path, opts) {
      var drive = await getOrLoadDrive(hyperClient, url)
      return pda.unlink(drive, path, opts)
    },

    async copy (path, dstPath, opts) {
      var drive = await getOrLoadDrive(hyperClient, url)
      return pda.copy(drive, path, dstPath, opts)
    },

    async rename (path, dstPath, opts) {
      var drive = await getOrLoadDrive(hyperClient, url)
      return pda.rename(drive, path, dstPath, opts)
    },

    async updateMetadata (path, metadata, opts) {
      var drive = await getOrLoadDrive(hyperClient, url)
      return pda.updateMetadata(drive, path, metadata, opts)
    },

    async deleteMetadata (path, keys, opts) {
      var drive = await getOrLoadDrive(hyperClient, url)
      return pda.deleteMetadata(drive, path, keys, opts)
    },

    async readdir (path = '/', opts) {
      var drive = await getOrLoadDrive(hyperClient, url)
      return pda.readdir(drive, path, opts)
    },

    async mkdir (path, opts) {
      var drive = await getOrLoadDrive(hyperClient, url)
      return pda.mkdir(drive, path, opts)
    },

    async rmdir (path, opts) {
      var drive = await getOrLoadDrive(hyperClient, url)
      return pda.rmdir(drive, path, opts)
    },

    async symlink (path, linkname, opts) {
      var drive = await getOrLoadDrive(hyperClient, url)
      return pda.symlink(drive, path, linkname, opts)
    },

    async mount (path, opts) {
      if (opts.url) opts = opts.url
      var drive = await getOrLoadDrive(hyperClient, url)
      return pda.mount(drive, path, opts)
    },

    async unmount (path, opts) {
      var drive = await getOrLoadDrive(hyperClient, url)
      return pda.unmount(drive, path, opts)
    },

    async query (opts) {
      if (typeof opts === 'string') {
        opts = {path: [opts]}
      }
      opts.drive = [url]
      throw new Error('TODO')
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
  return parseDriveUrl(massageUrl(scriptOrigin, url))
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


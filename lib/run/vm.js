import vm2 from 'vm2'
import mkdirp from 'mkdirp'
import { tmpdir, homedir } from 'os'
import { join as joinPath } from 'path'
import { randomBytes } from 'crypto'
import { hyperurlToKey } from '../opts.js'

import EventTarget from '@ungap/event-target'
import abab from 'abab'
import { Event } from './browser/event.js'
import { CustomEvent } from './browser/custom-event.js'
import fetch from 'node-fetch'
import FormData from 'form-data'
import { URLSearchParams } from 'url'
import nodeLS from 'node-localstorage'
import { createHyperdrive } from './beaker/hyperdrive.js'

// exported api
// =

export function create ({scriptUrl, hyperClient}) {
  var globalEventTarget = new EventTarget()
  var localStorage = createSbxStorage(joinPath(homedir(), '.bkr', 'local-storage', scriptUrlToFolderName(scriptUrl)))
  var sessionStorage = createSbxStorage(joinPath(tmpdir(), 'bkr', randomBytes(4).toString('hex'), 'session-storage'))
  var vm = new vm2.VM({
    sandbox: {
      get window () { return this },
      get globalThis () { return this },
      get self () { return this },

      close () { process.exit(0) },

      console: createSbxConsole(),
      location: createSbxLocation(scriptUrl),
  
      btoa: abab.btoa,
      atob: abab.atob,
  
      TextEncoder,
      TextDecoder,
  
      setTimeout,
      clearTimeout,
      setInterval,
      clearInterval,
  
      EventTarget,
      Event,
      CustomEvent,
      addEventListener: globalEventTarget.addEventListener.bind(globalEventTarget),
      removeEventListener: globalEventTarget.removeEventListener.bind(globalEventTarget),
      dispatchEvent: globalEventTarget.dispatchEvent.bind(globalEventTarget),
  
      URL,
  
      fetch,
      Headers: fetch.Headers,
      Request: fetch.Request,
      Response: fetch.Response,
      FormData,
      URLSearchParams,

      localStorage,
      sessionStorage,

      beaker: {
        hyperdrive: createHyperdrive({scriptUrl, hyperClient})
      }
    }
  })
  return vm
}

// internal methods
// =

function scriptUrlToFolderName (scriptUrl) {
  if (scriptUrl.startsWith('file:///')) {
    return 'file--' + scriptUrl.slice('file:///'.length).replace(/\//g, '-').toLowerCase()
  }
  if (scriptUrl.startsWith('hyper://')) {
    return 'hyper--' + hyperurlToKey(scriptUrl)
  }
}

function createSbxStorage (path) {
  mkdirp.sync(path)
  return new nodeLS.LocalStorage(path)
}

function createSbxLocation (scriptUrl) {
  let urlp = new URL(scriptUrl)
  return {
    ancestorOrigins: [],
    href: scriptUrl,
    protocol: urlp.protocol,
    host: urlp.host,
    hostname: urlp.hostname,
    port: urlp.port,
    pathname: urlp.pathname,
    search: urlp.search ? `?${urlp.search}` : '',
    hash: urlp.hash,
    origin: urlp.origin,
    toString () { return scriptUrl }
  }
}

function createSbxConsole () {
  var obj = {}
  var methods = [
    'assert', 'clear', 'count', 'countReset', 'debug', 'dir', 'dirxml', 'error', 'group', 'groupCollapsed',
    'groupEnd', 'info', 'log', 'table', 'time', 'timeEnd', 'timeLog', 'warn'
  ]
  for (let k of methods) {
    obj[k] = console[k]
  }
  obj.trace = (...args) => {
    // capture a stack that's constrained to the script vm
    var stack = (new Error()).stack
    var stackLines = stack.split('\n')
    stackLines = stackLines.slice(3)
    let i = stackLines.findIndex(v => v.includes('at Script.runInContext'))
    stackLines = stackLines.slice(0, i)

    console.log('Trace:', ...args, '\n' + stackLines.join('\n'))
  }
  return obj
}

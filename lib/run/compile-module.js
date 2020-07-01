import * as rollup from 'rollup'
import { promises as fsp } from 'fs'
import { resolve, dirname } from 'path'
import { readFile as hyperReadFile } from '../hyper/readfile.js'
import { parseHyperUrl } from '../urls.js'

const HAS_SCHEME_RE = /^[a-z]+:\/\//i
const LOG_LOADING = false
const LOG = LOG_LOADING ? (...args) => console.log('Compile-Module:', ...args) : function(){}

function preloadPlugin (scriptUrl) {
  return {
    name: 'preload',
    async intro () {
      return fsp.readFile(dirname(import.meta.url.slice('file://'.length)) + '/preload.js', 'utf8')
    }
  }
}

function hyperLoaderPlugin (scriptUrl) {
  return {
    name: 'hyper-loader',
    resolveId (source, importer) {
      if (source.startsWith('hyper://')) {
        return source
      }
      if (!HAS_SCHEME_RE.test(source) && importer && importer.startsWith('hyper://')) {
        LOG('hyper-loader resolve', source, importer)
        let urlp = parseHyperUrl(importer)
        urlp.pathname = resolve(dirname(urlp.pathname), source)
        source = `hyper://${urlp.hostname}${urlp.pathname}`
        LOG('...to', source)
        return source
      }
      return null
    },
    async load (id) {
      if (id.startsWith('hyper://')) {
        LOG('hyper-loader load',id)
        return await hyperReadFile(id, 'utf8')
      }
      return null
    }
  }
}

function fileLoaderPlugin (scriptUrl) {
  return {
    name: 'file-loader',
    resolveId (source, importer) {
      if (source.startsWith('file://')) return source
      if (!HAS_SCHEME_RE.test(source) && importer && importer.startsWith('file://')) {
        LOG('file-loader resolve', source, importer)
        importer = importer.slice('file://'.length)
        let path = resolve(dirname(importer), source)
        source = `file://${path}`
        LOG('...to', source)
        return source
      }
      return null
    },
    async load (id) {
      if (scriptUrl.startsWith('hyper://')) {
        return null // not allowed
      }
      if (id.startsWith('file://')) {
        LOG('file-loader load',id)
        let path = id.slice('file://'.length)
        return fsp.readFile(path, 'utf8')
      }
      return null
    }
  }
}

export async function compile (scriptUrl) {
  const bundle = await rollup.rollup({
    input: scriptUrl,
    plugins: [preloadPlugin(scriptUrl), hyperLoaderPlugin(scriptUrl), fileLoaderPlugin(scriptUrl)]
  })

  const { output } = await bundle.generate({
    format: 'es'
  })
  return output[0].code
}
import jayson from 'jayson/promise'

const METHODS = [
  'queryArchives',
  'getArchiveDetails',
  'getArchiveStats',
  'resolveName',
  'createNewArchive',
  'forkArchive',
  'setArchiveUserSettings',
  'writeArchiveFileFromPath',
]

// globals
// =

var client, rpc = {}

// exported api
// =
 
export function setup ({ port }) {
  client = jayson.client.tcp({ port })
  METHODS.forEach(method => {
    rpc[method] = (...args) => client.request(method, args).then(ret => ret.result)
  })
}

export function getClient () {
  if (!client) setup({ port: 17760 })
  return rpc
}
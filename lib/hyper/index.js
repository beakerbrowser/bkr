import HyperspaceClient from 'hyperspace/client.js'
import HyperspaceServer from 'hyperspace/server.js'
import { homedir } from 'os'
import { join as joinPath } from 'path'

export async function createServer () {
  var hserver
  const cleanup = async () => {
    console.log('Shutting down swarm, please wait...')
    if (hserver) await hserver.close()
  }
  process.once('SIGINT', cleanup)
  process.once('SIGTERM', cleanup)

  hserver = new HyperspaceServer({
    host: 'bkr',
    storage: joinPath(homedir(), '.bkr', 'hyper')
  })
  await hserver.ready()
  return hserver
}

export async function createClient () {
  var hclient
  const cleanup = async () => {
    if (hclient) await hclient.close()
  }
  process.once('SIGINT', cleanup)
  process.once('SIGTERM', cleanup)

  hclient = new HyperspaceClient({ host: 'bkr' })
  await hclient.ready()
  return hclient
}


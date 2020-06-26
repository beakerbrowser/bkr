import fs from 'fs'
import { resolve, join as joinPath, isAbsolute } from 'path'
import chalk from 'chalk'
import * as vm from '../run/vm.js'

export default {
  name: 'run',
  command: async function (args) {
    if (!args._[0]) throw new Error('URL or path is required')

    var script
    var scriptUrl = args._[0]
    if (scriptUrl.startsWith('hyper://')) {
      // TODO handle hyper://
      throw new Error('TODO')
    } else {
      var scriptPath = resolve(scriptUrl)
      scriptUrl = 'file://' + scriptPath
      script = fs.readFileSync(scriptPath, 'utf8')
    }
    
    var appDataPath = args['app-data']
    if (!isAbsolute(appDataPath)) appDataPath = resolve(process.cwd(), appDataPath)

    var scriptVm = vm.create({appDataPath, scriptUrl})
    scriptVm.run(script, scriptUrl)
  },
  options: [
    {
      name: 'app-data',
      boolean: false,
      default: joinPath(process.cwd(), '.app-data'),
      help: 'Where to store application data (local storage)'
    }
  ]
}

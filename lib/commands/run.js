import fs from 'fs'
import { resolve } from 'path'
import chalk from 'chalk'
import { createClient } from '../hyper/index.js'
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

    var hyperClient = await createClient()

    var scriptVm = vm.create({scriptUrl, hyperClient})
    scriptVm.run(script, scriptUrl)
  }
}

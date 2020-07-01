import fs from 'fs'
import { resolve } from 'path'
import chalk from 'chalk'
import { createClient } from '../hyper/index.js'
import * as vm from '../run/vm.js'
import { compile as compileModule } from '../run/compile-module.js'

export default {
  name: 'run',
  command: async function (args) {
    if (!args._[0]) throw new Error('URL or path is required')

    var scriptUrl = args._[0]
    if (!scriptUrl.startsWith('hyper://')) {
      var scriptPath = resolve(scriptUrl)
      scriptUrl = 'file://' + scriptPath
    }

    try {
      var script = await compileModule(scriptUrl)
    } catch (e) {
      console.log(e)
      throw e
    }
    
    var hyperClient = await createClient()
    var scriptVm = vm.create({scriptUrl, hyperClient})
    try {
      scriptVm.run(script, scriptUrl)
    } catch (e) {
      console.error(e)
    }
  }
}

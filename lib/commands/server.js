import chalk from 'chalk'
import { createServer } from '../hyper/index.js'

export default {
  name: 'server',
  command: async function (args) {
    console.log(chalk.bold('Initializing...'))
    var server = await createServer()
    console.log('hyper:// server active')
  }
}

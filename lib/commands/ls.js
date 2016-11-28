import chalk from 'chalk'
import { getClient } from '../client'

export default {
  name: 'ls',
  command: async function (args) {
    var rpc = getClient()

    // run query
    var query = { isSaved: true }
    if (args.mine) query.isOwner = true
    var archives = await rpc.queryArchives(query)

    // output results
    console.log('%d archives\n', archives.length)
    archives.forEach(archive => {
      var owned = chalk.bold((archive.isOwner) ? chalk.red('mine') : chalk.green('downloaded'))
      console.log(`  ${chalk.bold(archive.title || 'Untitled')} ${archive.description} (${owned})`)
      console.log(chalk.gray(`  dat://${archive.key}\n`))
    })
  },
  options: [
    {
      name: 'mine',
      boolean: true,
      default: false
    }
  ]
}

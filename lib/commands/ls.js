import chalk from 'chalk'
import { getClient } from '../client'
import { niceUrl, niceDate } from '../strings'
import { isDatUrl } from '../opts'

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

      var origin = ''
      if (archive.createdBy && isDatUrl(archive.createdBy.url)) {
        let { title, url } = archive.createdBy
        if (title) origin = chalk.bold(`via ${title}`)
        else origin = chalk.bold(`via ${niceUrl(url)}`)
      }
      else if (archive.forkOf && Array.isArray(archive.forkOf)) {
        let url = archive.forkOf[archive.forkOf.length - 1]
        if (isDatUrl(url)) origin = chalk.bold(`fork of ${niceUrl(url)}`)
      }

      console.log(`  ${chalk.bold(archive.title || 'Untitled')} (${owned}) ${niceDate(archive.mtime)} ${origin}`)
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

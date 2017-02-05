import chalk from 'chalk'

export function statusDiff (res) {
  const nAdded = res.addedFiles.length
  const nUpdated = res.updatedFiles.length
  if (nAdded === 0 && nUpdated === 0) {
    console.log(`No changes to publish, all files are up to date.`)
  } else {
    console.log(`\n${nAdded} new files, ${nUpdated} updates.`)
    console.log('')
    res.updatedFiles.forEach(file => console.log(`    ${chalk.red('modified:  '+file)}`))
    res.addedFiles.forEach(file => console.log(`    ${chalk.green('new file:  '+file)}`))
    console.log('')
  }
}
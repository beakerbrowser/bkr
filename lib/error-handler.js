import chalk from 'chalk'

export function wrapCommand (obj) {
  var innerCommand = obj.command
  obj.command = async function (...args) {
    try {
      await innerCommand(...args)
    } catch (err) {
      if (err.code === 'ECONNREFUSED') {
        out('Error: Could not connect to Beaker. Is it running?')
      } else {
        // generic output
        out(err)
      }
      process.exit(1)
    }
  }
  return obj
}

function out (...args) {
  console.error(chalk.bold.red(...args))  
}
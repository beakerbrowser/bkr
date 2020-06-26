import chalk from 'chalk'

export default function usage (err) {
  if (err) { 
    console.log(chalk.red(`${err}\n`))
  } else {
    console.log('')
  }
  console.log(`Usage: ${chalk.bold(`bkr`)} <command> ${chalk.gray(`[opts...]`)}

${chalk.bold(`Execution:`)}

  ${chalk.bold(`run`)} {js-path-or-hyper-url} ${chalk.gray(`[--app-data {path}]`)} - run a script

  ${chalk.green(`Learn more at https://github.com/beakerbrowser/bkr`)}
`)
  process.exit(err ? 1 : 0)
}
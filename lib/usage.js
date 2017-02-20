import chalk from 'chalk'

export default function usage (err) {
  if (err) { 
    console.log(chalk.red(`\n${err}`))
  } else {
    console.log('')
  }
  console.log(`Usage: ${chalk.bold(`bkr`)} <command> ${chalk.gray(`[opts...]`)}

${chalk.bold(`Publishing:`)}

  ${chalk.bold(`init`)} ${chalk.gray(`[directory]`)} - create a new dat
  ${chalk.bold(`fork`)} <dat-url|directory> ${chalk.gray(`[--cached] [directory]`)} - create a new dat by copying
  ${chalk.bold(`status`)} ${chalk.gray(`[directory]`)} - check the change status of a dat
  ${chalk.bold(`publish`)} ${chalk.gray(`[directory]`)} - publish a new version of a dat

${chalk.bold(`Fetching:`)}

  ${chalk.bold(`clone`)} <dat-url> ${chalk.gray(`[--cached] [directory]`)} - copy a dat into a dir
  ${chalk.bold(`pull`)} ${chalk.gray(`[--live] [directory]`)} - pull the latest version of a dat

${chalk.bold(`Open in beaker:`)}

  ${chalk.bold(`open`)} ${chalk.gray(`[directory]`)} - open the dat in a folder
  ${chalk.bold(`dev`)} ${chalk.gray(`[directory]`)} - create and open a temporary live-watching dat

${chalk.bold(`Management:`)}

  ${chalk.bold(`ls`)} ${chalk.gray(`[--mine]`)} - list dats saved in beaker
  ${chalk.bold(`save`)} <dat-url> - save a dat to beaker
  ${chalk.bold(`unsave`)} <dat-url> - unsave a dat from beaker

  ${chalk.blue(`Learn more at https://github.com/beakerbrowser/bkr`)}
`)
  process.exit(err ? 1 : 0)
}
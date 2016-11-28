export default function usage (err) {
  if (err) { 
    console.log(chalk.red(`\n${err}`))
  } else {
    console.log('')
  }
  console.log(`Usage: ${chalk.bold(`bkr`)} <command> ${chalk.gray(`[opts...]`)}

  ${chalk.bold(`init`)} ${chalk.gray(`[directory]`)}
  ${chalk.bold(`co`)} <dat-link> ${chalk.gray(`[directory]`)}
  ${chalk.bold(`fork`)} <dat-link|directory> ${chalk.gray(`[directory]`)}

  ${chalk.bold(`dev`)} ${chalk.gray(`[directory]`)}

  ${chalk.bold(`status`)} ${chalk.gray(`[directory]`)}
  ${chalk.bold(`pull`)} ${chalk.gray(`[--live] [directory]`)}
  ${chalk.bold(`publish`)} ${chalk.gray(`[major|minor|patch|{version}] [directory]`)}

  ${chalk.bold(`ls`)} ${chalk.gray(`[--mine]`)}
  ${chalk.bold(`add`)} <dat-link|dat-ref>
  ${chalk.bold(`rm`)} <dat-link|dat-ref>
  ${chalk.bold(`host`)} <dat-link|dat-ref>
  ${chalk.bold(`unhost`)} <dat-link|dat-ref>

  ${chalk.blue(`Learn more at https://github.com/beakerbrowser/bkr`)}
`)
  process.exit(err ? 1 : 0)
}
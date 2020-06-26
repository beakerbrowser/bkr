main()
async function main () {
  console.log('Fetching my profile json...')
  console.log(await beaker.hyperdrive.readFile('hyper://6900790c2dba488ca132a0ca6d7259180e993b285ede6b29b464b62453cd5c39/index.json', 'utf8'))
  close()
}
main()
async function main () {
  try {
    console.log('Fetching...')
    console.log(await beaker.hyperdrive.stat('hyper://a8e9bd0f4df60ed5246a1b1f53d51a1feaeb1315266f769ac218436f12fda830/index.json'))
    console.log(await beaker.hyperdrive.readFile('hyper://a8e9bd0f4df60ed5246a1b1f53d51a1feaeb1315266f769ac218436f12fda830/index.json', 'utf8'))
    console.log(await beaker.hyperdrive.readdir('hyper://a8e9bd0f4df60ed5246a1b1f53d51a1feaeb1315266f769ac218436f12fda830/'))
    console.log(await beaker.hyperdrive.readdir('hyper://a8e9bd0f4df60ed5246a1b1f53d51a1feaeb1315266f769ac218436f12fda830/', {recursive: true}))
    console.log(await beaker.hyperdrive.readdir('hyper://a8e9bd0f4df60ed5246a1b1f53d51a1feaeb1315266f769ac218436f12fda830/', {includeStats: true}))
    var drive = beaker.hyperdrive.drive('hyper://a8e9bd0f4df60ed5246a1b1f53d51a1feaeb1315266f769ac218436f12fda830/')
    console.log(await drive.stat('/index.json'))
    console.log(await drive.readFile('/index.json', 'utf8'))
    console.log(await drive.readdir('/'))
    console.log(await drive.readdir('/', {recursive: true}))
    console.log(await drive.readdir('/', {includeStats: true}))
    console.log('done')
  } catch (e) {
    console.log('Error:', e)
  }
  close()
}
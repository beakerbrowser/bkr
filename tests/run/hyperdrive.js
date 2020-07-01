import { test, ok, cmp } from '../run-test-suite.js'

const MANIFEST = {
  title: 'Test drive',
  description: 'Drive created by test suite'
}

main()
async function main () {
  var drive
  await test('createDrive()', async () => {
    drive = await beaker.hyperdrive.createDrive(MANIFEST)
    await ok(!!drive, 'Drive created')
    await ok(drive.url && typeof drive.url === 'string', 'Created drive has a URL')
  })
  await test('readFile()', async () => {
    await cmp(drive.readFile('/index.json', 'json'), MANIFEST, 'readFile JSON encoding works')
    await cmp(drive.readFile('/index.json', 'utf8'), JSON.stringify(MANIFEST, null, 2), 'readFile utf8 encoding works')
    let buf = await drive.readFile('/index.json', 'binary')
    var encoder = new TextEncoder()
    await cmp(buf, encoder.encode(JSON.stringify(MANIFEST, null, 2)), 'readFile binary encoding works')
  })
}
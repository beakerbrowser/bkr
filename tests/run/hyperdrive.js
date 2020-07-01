import { test, ok, cmp, throws, skip } from '../run-test-suite.js'

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
    await drive.mkdir('/subdir')
    await drive.writeFile('/test.txt', 'hello')
    await drive.writeFile('/subdir/test.txt', 'world')
  })
  await test('forkDrive', async () => {
    console.log('⚠️ TODO')
  })
  await test('drive', async () => {
    console.log('⚠️ TODO')
  })
  await test('getInfo', async () => {
    console.log('⚠️ TODO')
  })
  await test('configure', async () => {
    console.log('⚠️ TODO')
  })
  await test('checkout', async () => {
    console.log('⚠️ TODO')
  })
  await test('diff', async () => {
    console.log('⚠️ TODO')
  })
  await test('stat()', async () => {
    const isFileStat = (v) => {
      return v && v.isFile() && v.ctime instanceof Date && v.mtime instanceof Date
    }
    await ok(isFileStat(await drive.stat('/index.json')), 'stat(/index.json) file')
    await ok(isFileStat(await beaker.hyperdrive.stat(drive.url + 'index.json')), 'stat(/index.json) file')
    await ok(isFileStat(await drive.stat('/subdir/test.txt')), 'stat(/subdir/test.txt) file')
    await ok(isFileStat(await beaker.hyperdrive.stat(drive.url + 'subdir/test.txt')), 'stat(/subdir/test.txt) file')
    const isDirStat = (v) => {
      return v && v.isDirectory() && v.ctime instanceof Date && v.mtime instanceof Date
    }
    await ok(isDirStat(await drive.stat('/')), 'stat(/) dir')
    await ok(isDirStat(await beaker.hyperdrive.stat(drive.url)), 'stat(/) dir')
    await ok(isDirStat(await drive.stat('/subdir')), 'stat(/subdir) dir')
    await ok(isDirStat(await beaker.hyperdrive.stat(drive.url + 'subdir')), 'stat(/subdir) dir')
    await throws(drive.stat('/foo'), 'Not found throws an error')
    await throws(beaker.hyperdrive.stat(drive.url + 'foo'), 'Not found throws an error')
  })
  await test('readFile()', async () => {
    await cmp(drive.readFile('/index.json', 'json'), MANIFEST, 'readFile JSON encoding works')
    await cmp(beaker.hyperdrive.readFile(drive.url + 'index.json', 'json'), MANIFEST, 'readFile JSON encoding works')
    await cmp(drive.readFile('/index.json', 'utf8'), JSON.stringify(MANIFEST, null, 2), 'readFile utf8 encoding works')
    await cmp(beaker.hyperdrive.readFile(drive.url + 'index.json', 'utf8'), JSON.stringify(MANIFEST, null, 2), 'readFile utf8 encoding works')
    var encoder = new TextEncoder()
    let buf = await drive.readFile('/index.json', 'binary')
    await cmp(buf, encoder.encode(JSON.stringify(MANIFEST, null, 2)), 'readFile binary encoding works')
    buf = await beaker.hyperdrive.readFile(drive.url + 'index.json', 'binary')
    await cmp(buf, encoder.encode(JSON.stringify(MANIFEST, null, 2)), 'readFile binary encoding works')
    await throws(drive.readFile('/foo'), 'Not found throws an error')
    await throws(beaker.hyperdrive.readFile(drive.url + 'foo'), 'Not found throws an error')
    await skip('Shouldnt it throw?', throws(drive.readFile('/subdir'), 'Subdir throws an error'))
    await skip('Shouldnt it throw?', throws(beaker.hyperdrive.readFile(drive.url + 'subdir'), 'Subdir throws an error'))
    await throws(drive.readFile('/'), 'Root dir throws an error')
    await throws(beaker.hyperdrive.readFile(drive.url), 'Root dir throws an error')
  })
  await test('readdir()', async () => {
    await cmp((await drive.readdir('/')).sort(), ['index.json', 'test.txt', 'subdir'].sort(), 'readdir()')
    await cmp((await beaker.hyperdrive.readdir(drive.url)).sort(), ['index.json', 'test.txt', 'subdir'].sort(), 'readdir()')
    await cmp((await drive.readdir('/subdir')).sort(), ['test.txt'].sort(), 'readdir(/subdir)')
    await cmp((await beaker.hyperdrive.readdir(drive.url + 'subdir')).sort(), ['test.txt'].sort(), 'readdir(/subdir)')
    await cmp((await drive.readdir('/', {recursive: true})).sort(), ['index.json', 'test.txt', 'subdir', 'subdir/test.txt'].sort(), 'readdir() recursive')
    await cmp((await beaker.hyperdrive.readdir(drive.url, {recursive: true})).sort(), ['index.json', 'test.txt', 'subdir', 'subdir/test.txt'].sort(), 'readdir() recursive')
    const rightShapes = (arr) => arr.length === 3 && arr.every(v => typeof v.name === 'string' && typeof v.stat === 'object')
    await ok(rightShapes(await drive.readdir('/', {includeStats: true})), 'readdir() include stats')
    await ok(rightShapes(await beaker.hyperdrive.readdir(drive.url, {includeStats: true})), 'readdir() include stats')
  })
  await test('writeFile', async () => {
    console.log('⚠️ TODO')
  })
  await test('unlink', async () => {
    console.log('⚠️ TODO')
  })
  await test('copy', async () => {
    console.log('⚠️ TODO')
  })
  await test('rename', async () => {
    console.log('⚠️ TODO')
  })
  await test('updateMetadata', async () => {
    console.log('⚠️ TODO')
  })
  await test('deleteMetadata', async () => {
    console.log('⚠️ TODO')
  })
  await test('mkdir', async () => {
    console.log('⚠️ TODO')
  })
  await test('rmdir', async () => {
    console.log('⚠️ TODO')
  })
  await test('symlink', async () => {
    console.log('⚠️ TODO')
  })
  await test('mount', async () => {
    console.log('⚠️ TODO')
  })
  await test('unmount', async () => {
    console.log('⚠️ TODO')
  })
  await test('query', async () => {
    console.log('⚠️ TODO')
  })
  await test('watch', async () => {
    console.log('⚠️ TODO')
  })
}
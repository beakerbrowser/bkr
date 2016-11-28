import fs from 'fs-promise'
import path from 'path'

export async function isDirClean (dir) {
  // dir exists
  var stat = await fs.stat(dir).catch(err => { throw new Error(`${dir} is not a valid directory`) })
  // is directory
  if (!stat.isDirectory()) throw new Error(`${dir} is not a directory`)
  // is clean
  var hasManifest = false, manifest = false
  try {
    manifest = await fs.readFile(path.join(dir, 'dat.json'), 'utf8')
    hasManifest = true
    manifest = JSON.parse(manifest)
  } catch (e) {}
  if (manifest) throw new Error(`${dir} already has a dat.json (${manifest.title || manifest.url})`)
  if (hasManifest) throw new Error(`${dir} already has a dat.json`)
}
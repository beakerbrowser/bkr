import fs from 'fs-promise'
import path from 'path'

export async function isDirInitable (dir) {
  // dir exists
  var stat = await fs.stat(dir).catch(err => { throw new Error(`Destination path '${dir}' is not a valid directory`) })
  // is directory
  if (!stat.isDirectory()) throw new Error(`Destination path '${dir}' is not a directory`)
  // doesnt have a manifest yet
  var hasManifest = false, manifest = false
  try {
    manifest = await fs.readFile(path.join(dir, 'dat.json'), 'utf8')
    hasManifest = true
    manifest = JSON.parse(manifest)
  } catch (e) {}
  if (manifest) throw new Error(`Destination path '${dir}' already has a dat.json (${manifest.title || manifest.url})`)
  if (hasManifest) throw new Error(`Destination path '${dir}' already has a dat.json`)
}

export async function isDirClean (dir) {
  // does dir exist? if not, we're good
  var stat
  try { stat = await fs.stat(dir) }
  catch (e) { return /* does not exist, we can create it */ }
  // is directory
  if (!stat.isDirectory()) throw new Error(`Destination path '${dir}' is not a directory`)
  // is empty
  var files = await fs.readdir(dir)
  if (files.length > 0) throw new Error(`Destination path '${dir}' is not empty, aborting`)
}

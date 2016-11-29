import path from 'path'

const DAT_URL_REGEX = /^(dat:\/\/)?([0-9a-f]{64})/i

export function parseDatUrl (url) {
  return DAT_URL_REGEX.exec(url)
}

export function isDatUrl (url) {
  return !!parseDatUrl(url)
}

export function daturlOpt (arg) {
  if (arg) {
    var match = DAT_URL_REGEX.exec(arg)
    if (match) return `dat://${match[2]}`
  }
}

export function dirOpt (arg) {
  if (arg) {
    if (!path.isAbsolute(arg)) return path.resolve(process.cwd(), arg)
    return arg
  }
  return process.cwd()
}

export function daturlToKey (url) {
  var match = DAT_URL_REGEX.exec(url)
  return match && match[2]
}
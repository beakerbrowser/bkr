import path from 'path'
import datDnsCons from 'dat-dns'

const datDns = datDnsCons()
const DAT_URL_REGEX = /^(dat:\/\/)?([0-9a-f]{64})/i
const DOMAIN_REGEX = /^(dat:\/\/)?([^:\/]+)/i

export function parseDatUrl (url) {
  return DAT_URL_REGEX.exec(url)
}

export function isDatUrl (url) {
  return !!parseDatUrl(url)
}

export async function daturlOpt (arg) {
  if (arg) {
    var match = DAT_URL_REGEX.exec(arg)
    if (match) return `dat://${match[2]}`
    match = DOMAIN_REGEX.exec(arg)
    if (match) {
      var key = await datDns.resolveName(match[2])
      return `dat://${key}`
    }
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
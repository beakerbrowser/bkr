import chalk from 'chalk'
import prettyHash from 'pretty-hash'
import { daturlToKey } from './opts'

// template tag
export function trim (strings, ...values) {
  var str = String.raw(strings, ...values)
  return str.replace(/^([ ]+)/gm, '').replace(/([ ]+)$/gm, '')
}

export function niceUrl (url, shorten) {
  if (shorten) {
    var key = daturlToKey(url)
    url = 'dat://' + prettyHash(key)
  }
  return chalk.gray(url)
}
// template tag
export function trim (strings, ...values) {
  var str = String.raw(strings, ...values)
  return str.replace(/^([ ]+)/gm, '').replace(/([ ]+)$/gm, '')
}
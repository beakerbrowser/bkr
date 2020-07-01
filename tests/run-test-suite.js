export async function test(label, fn) {
  console.log('=== ⚡️', label, '⚡️ ===')
  try {
    await fn()
  } catch (e) {
    console.log(e.toString())
  }
}

export async function cmp (a, b, label = 'cmp') {
  try {
    let ares = a instanceof Promise ? await a : a
    let bres = b instanceof Promise ? await b : b
    assert(deepEqual(ares, bres), `Expected:\n${strOf(bres)}\nGot:\n${strOf(ares)}`)
    console.log('✅', label)
  } catch (e) {
    console.log('❌', label)
    throw e
  }
}

export async function ok (a, label = 'ok') {
  try {
    let ares = a instanceof Promise ? await a : a
    assert(!!ares, `Failed:\n${strOf(ares)}`)
    console.log('✅', label)
  } catch (e) {
    console.log('❌', label)
    throw e
  }
}

function assert (v, ...str) {
  if (!v) throw new Error(str.join(' '))
}

export function deepEqual (x, y) {
  if (x === y) {
    return true;
  }
  else if (x instanceof ArrayBuffer && y instanceof ArrayBuffer) {
    if (x.byteLength != y.byteLength) return false;
    var dv1 = new Int8Array(x);
    var dv2 = new Int8Array(y);
    for (var i = 0 ; i != x.byteLength ; i++) {
      if (dv1[i] != dv2[i]) return false;
    }
    return true;
  }
  else if ((typeof x == "object" && x != null) && (typeof y == "object" && y != null)) {
    if (Object.keys(x).length != Object.keys(y).length) {
      console.log('Fail on key count', x, y)
      return false;
    }

    for (var prop in x) {
      if (y.hasOwnProperty(prop))
      {  
        if (! deepEqual(x[prop], y[prop]))
          return false;
      }
      else {
        console.log('Fail on key membership', prop)
        return false;
      }
    }
    return true;
  }
  else {
    console.log('Fail on compare', x, y)
    return false;
  }
}

function strOf (v) {
  if (v instanceof ArrayBuffer) {
    return v.toString()//`ArrayBuffer`
  }
  if (v instanceof Uint8Array) {
    return `Uint8Array`
  }
  if (v instanceof Int8Array) {
    return `Int8Array`
  }
  return JSON.stringify(v, null, 2)
}
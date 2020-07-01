;(function () {
console.log('Running preload')

// HACK
// as far as I can tell, the nodejs vm (or vm2) does not use
// the ArrayBuffer or TypedDataView objects that are native
// to the VM's realm, causing things like `v instanceof ArrayBuffer`
// to "incorrectly" fail. To solve that, we have to convert responses
// to the correc type. On top of that, some functions return node's
// Buffer type, which we also have to convert.
// -prf

convertPrototypeCall(TextEncoder, 'encode')
convertPrototypeCall(TextDecoder, 'decode')

convertAsyncDriveRespondingCall(beaker.hyperdrive, 'createDrive')
convertAsyncDriveRespondingCall(beaker.hyperdrive, 'forkDrive')
convertDriveRespondingCall(beaker.hyperdrive, 'drive')
convertAsyncCall(beaker.hyperdrive, 'readFile')
// TODO: stat, query, anything with key buffers

function convertDriveRespondingCall (obj, fnName) {
  var orgFn = obj[fnName]
  obj[fnName] = function (...args) {
    let drive = orgFn.call(this, ...args)
    convertDriveObj(drive)
    return drive
  }
}

function convertAsyncDriveRespondingCall (obj, fnName) {
  var orgFn = obj[fnName]
  obj[fnName] = async function (...args) {
    let drive = await orgFn.call(this, ...args)
    convertDriveObj(drive)
    return drive
  }
}

function convertDriveObj (drive) {
  convertDriveRespondingCall(drive, 'checkout')
  convertAsyncCall(drive, 'readFile')
}

function convertPrototypeCall (obj, fnName) {
  var orgFn = obj.prototype[fnName]
  obj.prototype[fnName] = function (...args) {
    return bufferToArrayBuffer(orgFn.call(this, ...args))
  }
}

function convertAsyncCall (obj, fnName) {
  var orgFn = obj[fnName]
  obj[fnName] = async function (...args) {
    return bufferToArrayBuffer(await orgFn.call(this, ...args))
  }
}

function bufferToArrayBuffer (v) {
  if (Buffer.isBuffer(v)) {
    // well this sucks
		var arrayCopy = new Uint8Array(v.length)
		var len = v.length
		for (var i = 0; i < len; i++) {
			arrayCopy[i] = v[i]
		}
		return arrayCopy.buffer
  } else if (v.buffer) {
    // a typed array that we need to convert to our realm's native object
    return new Uint8Array(new ArrayBuffer(v.buffer))
  }
  return v
}

function convertResponse (ctx, fn) {
  return (...args) => bufferToArrayBuffer(fn.call(ctx, fn))
}

function convertAsyncResponse (ctx, fn) {
  return async (...args) => bufferToArrayBuffer(await fn.call(ctx, fn))
}

function convertResponses (arr) {
  for (let [ctx, fnName] of arr) {
    console.log('converting response', ctx, fnName)
    self[ctx][fnName] = convertResponse(self[ctx], self[ctx][fnName])
  }
}

function convertAsyncResponses (arr) {
  for (let [ctx, fnName] of arr) {
    self[ctx][fnName] = convertAsyncResponse(self[ctx], self[ctx][fnName])
  }
}

})();
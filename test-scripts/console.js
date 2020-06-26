console.log('Hello World!')

console.group('Group 1')
console.log('Hello')
console.warn('World')
console.group('Group 2')
console.log('Hello')
console.warn('World')
console.groupEnd()
console.log('Hello')
console.warn('World')
console.groupEnd()

console.table({
  a: 1,
  b: 2,
  c: 3
})

console.time('timer')
console.timeLog('timer')
console.timeEnd('timer')

function myFunc () {
  console.trace('Give a stack to this call please')
}
myFunc()
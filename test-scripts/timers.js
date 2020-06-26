var i = setInterval(() => {
  console.log('interval hit')
}, 50)

var t1 = setTimeout(() => console.log('should not hit'), 100)
clearTimeout(t1)

setTimeout(() => {
  console.log('timed out')
  clearInterval(i)
}, 350)
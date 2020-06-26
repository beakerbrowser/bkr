console.log('LocalStorage:')

console.log(localStorage.foo, localStorage.getItem('foo'), localStorage.fuz, localStorage.getItem('fuz'))
localStorage.foo = 'bar'
localStorage.setItem('fuz', 'baz')
console.log(localStorage.foo, localStorage.getItem('foo'), localStorage.fuz, localStorage.getItem('fuz'))
delete localStorage.foo
localStorage.removeItem('fuz')
console.log(localStorage.foo, localStorage.getItem('foo'), localStorage.fuz, localStorage.getItem('fuz'))

console.log('This script was last run on', localStorage.lastRun)
localStorage.lastRun = (new Date()).toLocaleString()


console.log('SessionStorage:')

console.log(sessionStorage.foo, sessionStorage.getItem('foo'), sessionStorage.fuz, sessionStorage.getItem('fuz'))
sessionStorage.foo = 'bar'
sessionStorage.setItem('fuz', 'baz')
console.log(sessionStorage.foo, sessionStorage.getItem('foo'), sessionStorage.fuz, sessionStorage.getItem('fuz'))
delete sessionStorage.foo
sessionStorage.removeItem('fuz')
console.log(localStorage.foo, localStorage.getItem('foo'), localStorage.fuz, localStorage.getItem('fuz'))

console.log('This script was last run on', sessionStorage.lastRun)
sessionStorage.lastRun = (new Date()).toLocaleString()
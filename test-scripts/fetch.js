main()
async function main () {
  var res = await fetch('https://userlist.beakerbrowser.com/list.json')
  console.log(res.ok)
  console.log(res.headers)
  console.log(res.status)
  console.log(res.statusText)
  console.log((await res.json()).users.length, 'users')
}
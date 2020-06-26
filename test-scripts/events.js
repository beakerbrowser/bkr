var evts = new EventTarget()
evts.addEventListener('simple', console.log)
evts.addEventListener('logs-once', console.log, {once: true})
evts.addEventListener('custom', console.log)

evts.dispatchEvent(new Event('simple'))
evts.dispatchEvent(new Event('logs-once'))
evts.dispatchEvent(new Event('logs-once'))
evts.dispatchEvent(new CustomEvent('custom', {detail: {foo: 'bar'}}))

evts.removeEventListener('simple', console.log)
evts.removeEventListener('custom', console.log)

evts.dispatchEvent(new Event('simple'))
evts.dispatchEvent(new CustomEvent('custom', {detail: {foo: 'bar'}}))

window.addEventListener('window-simple', console.log)
window.addEventListener('window-logs-once', console.log, {once: true})
window.addEventListener('window-custom', console.log)

window.dispatchEvent(new Event('window-simple'))
window.dispatchEvent(new Event('window-logs-once'))
window.dispatchEvent(new Event('window-logs-once'))
window.dispatchEvent(new CustomEvent('window-custom', {detail: {foo: 'bar'}}))

window.removeEventListener('window-simple', console.log)
window.removeEventListener('window-custom', console.log)

window.dispatchEvent(new Event('window-simple'))
window.dispatchEvent(new CustomEvent('window-custom', {detail: {foo: 'bar'}}))
import db from '../db'

export default { builder, handler : stop}

function builder(yargs) {
  return yargs
  .usage('Usage: tick stop')
}

function stop(argv) {
  db.get('_local/timers')
  .then(timersDoc => stopTimer(timersDoc))
  .catch(() => console.log('You do not have a timer started'))
}

function stopTimer(timersDoc) {
  const timer = timersDoc.timers.pop()

  if (!timer) return console.log('You do not have a timer started')

  db.put(timersDoc)
  .then(() => console.log(`Stopped ${timer} timer`))
  .catch(err => console.log(`Could not stop your timer\n${err.message}`))
}

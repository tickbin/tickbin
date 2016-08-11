import db from '../db'

export default { builder, handler : start}

const defTimersDoc = {
  _id: '_local/timers',
  timers: []
}

function builder(yargs) {
  return yargs
  .usage('Usage: tick start')
}

function start(argv) {
  //  If the timers document exists, pass it to saveTimer. Otherwise pass the
  //  defTimersDoc
  db.get(defTimersDoc._id)
  .then(timersDoc => saveTimer(timersDoc))
  .catch(() => saveTimer(defTimersDoc))
}

function saveTimer(timersDoc) {
  //  For now only allow one timer at a time
  if (timersDoc.timers.length > 0) {
    return console.log('You already have a timer running. You can run:\n'
      + '  tick stop: to finish timer and commit entry\n'
      + '  tick cancel-timer: to abort the timer')
  }

  const start = new Date()

  timersDoc.timers.push(start)

  db.put(timersDoc)
  .then(() => console.log(`Started timer at ${start}`))
  .catch(err => console.log(`Could not start your timer\n${err.message}`))
}

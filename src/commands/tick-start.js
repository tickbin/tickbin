import db from '../db'

export default { builder, handler : start}

const defTimerDoc = {
  _id: '_local/timers',
  timers: []
}

function builder(yargs) {
  return yargs
  .usage('Usage: tick start')
}

function start(argv) {
  //  If the timers document exists, pass it to saveTimer. Otherwise pass the
  //  defTimerDoc
  db.get(defTimerDoc._id)
  .then(timerDoc => saveTimer(timerDoc))
  .catch(() => saveTimer(defTimerDoc))
}

function saveTimer(timerDoc) {
  //  For now only allow one timer at a time
  if (timerDoc.timers.length > 0) {
    return console.log('You already have a timer running. You can run:\n'
      + '  tick stop: to finish timer and commit entry\n'
      + '  tick cancel-timer: to abort the timer')
  }

  const start = new Date()

  timerDoc.timers.push(start)

  db.put(timerDoc)
  .then(() => console.log(`Started timer at ${start}`))
  .catch(err => console.log(`Could not start your timer\n${err.message}`))
}

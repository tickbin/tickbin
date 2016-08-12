import { parser } from 'tickbin-parser'
import { writeSavedTimer } from './output'
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
  db.get('_local/timers')
  .then(
    //  If the timers document exists, pass it to saveTimer. Otherwise pass the
    //  defTimersDoc
    timerDoc => saveTimer(timerDoc, argv._[1]),
    () => saveTimer(defTimerDoc, argv._[1])
  )
  .then(writeSavedTimer)
  .catch(err => console.log(`Could not start your timer\n${err.message}`))
}

function saveTimer(timersDoc, originalMessage) {
  //  For now only allow one timer at a time
  if (timersDoc.timers.length > 0) {
    throw { message: 'You already have a timer running. You can run:\n'
      + '  tick stop: to finish timer and commit entry\n'
      + '  tick cancel-timer: to abort the timer' }
  }

  let timer
  if (originalMessage) {
    const { start, message } = parser(originalMessage)
    timer = { start: start || new Date(), message }
  } else {
    timer = { start: new Date() }
  }

  timersDoc.timers.push(timer)

  return db.put(timersDoc)
  .then(() => timer)
}

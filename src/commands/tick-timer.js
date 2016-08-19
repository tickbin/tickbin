import db from '../db'
import { writeTimer } from './output'

export default { builder, handler: timer }

function builder(yargs) {
  return yargs
  .usage('Usage: tick timer')
}

function timer() {
  db.get('_local/timers')
  .then(getTimer)
  .then(writeTimer)
  .catch(err => console.log(`Could not list your timer\n${err.message}`))
}

function getTimer(timersDoc) {
  const timer = timersDoc.timers[0]

  if (!timer) throw new Error('You do not have a timer started')

  return timer
}

import db from '../db'
import { writeRemoveTimer } from './output'

export default { builder, handler: cancelTimer }

function builder(yargs) {
  return yargs
  .usage('Usage: tick cancel-timer')
}

function cancelTimer() {
  db.get('_local/timers')
  .then(removeTimer)
  .then(writeRemoveTimer)
  .catch(err => console.log(`Could not cancel your timer\n${err.message}`))
}

function removeTimer(timersDoc) {
  const timer = timersDoc.timers.pop()

  if (!timer) throw { message: 'You do not have a timer started' }

  return db.put(timersDoc)
  .then(() => timer)
}

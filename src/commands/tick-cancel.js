import db from '../db'
import { writeRemoveTimer } from './output'
import { removeTimer } from '../timers'

export default { builder, handler: cancel }

function builder(yargs) {
  return yargs
  .usage('Usage: tick cancel-timer')
  .example('tick cancel-timer', 'cancels the current timer without commiting')
}

function cancel() {
  db.get('_local/timers')
  .then(removeTimer)
  .then(writeRemoveTimer)
  .catch(err => console.error(`Could not cancel your timer\n${err.message}`))
}

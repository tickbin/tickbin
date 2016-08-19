import db from '../db'
import { writeTimer } from './output'
import { getTimer } from '../timers'

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

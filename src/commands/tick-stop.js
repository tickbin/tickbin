import db from '../db'
import { writeSaved } from './output'
import { parseMessage, commitTimer } from '../timers'

export default { builder, handler : stop}

function builder(yargs) {
  return yargs
  .usage('Usage: tick stop')
  .example('tick stop', 'stop timer for the current time')
  .example('tick stop "10am"', 'stop timer for 10am')
  .example('tick stop "10am creating bugs #dev"', 'stop timer for 10am and provide new commit message')
}

function stop(argv) {
  db.get('_local/timers')
  .then(timersDoc => parseMessage(db, timersDoc, argv._[1]))
  .then(timer => commitTimer(db, timer))
  .then(writeSaved)
  .catch(err => console.error(`Could not stop your timer\n${err.message}`))
}

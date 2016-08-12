import moment from 'moment'
import db from '../db'
import createEntry from '../create'
import { writeSaved } from './output'

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
  .then(() => commitTimer(timer))
  .catch(err => console.log(`Could not stop your timer\n${err.message}`))
}

function commitTimer(timer) {
  const dateFormat = 'MMM D h:mma'
  const start = moment(timer).format(dateFormat)
  const stop = moment().format(dateFormat)
  const message = 'entry made by a timer'

  const commitMessage = `${start} - ${stop} ${message}`

  createEntry(db, commitMessage)
  .then(writeSaved)
}

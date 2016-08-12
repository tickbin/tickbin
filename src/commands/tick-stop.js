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
  .then(stopTimer)
  .then(commitTimer)
  .then(writeSaved)
  .catch(err => console.log(`Could not stop your timer\n${err.message}`))
}

function stopTimer(timersDoc) {
  const timer = timersDoc.timers.pop()

  if (!timer) throw { message: 'You do not have a timer started' }

  return db.put(timersDoc)
  .then(() => timer)
}

function commitTimer(timer) {
  const dateFormat = 'MMM D h:mma'
  const start = moment(timer).format(dateFormat)
  const stop = moment().format(dateFormat)
  const message = 'entry made by a timer'

  const commitMessage = `${start} - ${stop} ${message}`

  return createEntry(db, commitMessage)
}

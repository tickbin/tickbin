import prompt from 'prompt'
import moment from 'moment'
import { parser } from 'tickbin-parser'
import createEntry from './create'

export { saveTimer }
export { commitTimer }
export { removeTimer }
export { getTimer }

function saveTimer(db, timersDoc, originalMessage) {
  if (!db) throw new Error('Please provide a couchdb instance')
  if (!timersDoc) throw new Error('Please provide a document of timers')

  //  For now only allow one timer at a time
  if (timersDoc.timers.length > 0) {
    throw new Error('You already have a timer running. You can run:\n'
      + '  tick stop: to finish timer and commit entry\n'
      + '  tick cancel-timer: to abort the timer')
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

function commitTimer(db, timer) {
  if (!db) throw new Error('Please provide a couchdb instance')
  if (!timer) throw new Error('Please provide a timer')

  const dateFormat = 'MMM D h:mma'
  const start = moment(timer.start).format(dateFormat)
  const end = moment(timer.end).format(dateFormat)
  const message = timer.message

  return createEntry(db, `${start} - ${end} ${message}`)
}

function removeTimer(db, timersDoc) {
  if (!db) throw new Error('Please provide a couchdb instance')
  if (!timersDoc) throw new Error('Please provide a document of timers')

  const timer = timersDoc.timers.pop()

  if (!timer) throw new Error('You do not have a timer started')

  return db.put(timersDoc)
  .then(() => timer)
}

function getTimer(timersDoc) {
  if (!timersDoc) throw new Error('Please provide a document of timers')

  const timer = timersDoc.timers[0]

  if (!timer) throw new Error('You do not have a timer started')

  return timer
}

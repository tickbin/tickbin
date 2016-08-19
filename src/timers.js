import prompt from 'prompt'
import moment from 'moment'
import { parser } from 'tickbin-parser'
import db from './db'
import createEntry from './create'

export { saveTimer }
export { parseMessage }
export { commitTimer }
export { removeTimer }
export { getTimer }

function saveTimer(timersDoc, originalMessage) {
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

function parseMessage(timersDoc, newMessage) {
  const timer = timersDoc.timers.pop()

  if (!timer) throw new Error('You do not have a timer started')

  if (!timer.message && !newMessage) {
    prompt.message = ''
    prompt.delimiter = ''
    prompt.start()
    return new Promise((resolve, reject) => {
      prompt.get('message', (err, res) => {
        if (err && err.message === 'canceled')
          return reject(new Error('You canceled the stop command'))

        if (err)
          return reject(err)

        //  When parsing a single date it is always returned as 'start'. Renaming
        //  to 'end' here for clarity.
        const { start: end, message } = parser(res.message)
        timer.end = end || new Date()
        if (message) timer.message = message

        db.put(timersDoc)
        .then(() => resolve(timer))
      })
    })
  } else if (newMessage) {
    //  When parsing a single date it is always returned as 'start'. Renaming
    //  to 'end' here for clarity.
    const { start: end, message } = parser(newMessage)
    timer.end = end || new Date()
    if (message) timer.message = message

    return db.put(timersDoc)
    .then(() => timer)
  } else {
    timer.end = new Date()

    return db.put(timersDoc)
    .then(() => timer)
  }
}

function commitTimer(timer) {
  const dateFormat = 'MMM D h:mma'
  const start = moment(timer.start).format(dateFormat)
  const end = moment(timer.end).format(dateFormat)
  const message = timer.message

  return createEntry(db, `${start} - ${end} ${message}`)
}

function removeTimer(timersDoc) {
  const timer = timersDoc.timers.pop()

  if (!timer) throw new Error('You do not have a timer started')

  return db.put(timersDoc)
  .then(() => timer)
}

function getTimer(timersDoc) {
  const timer = timersDoc.timers[0]

  if (!timer) throw new Error('You do not have a timer started')

  return timer
}

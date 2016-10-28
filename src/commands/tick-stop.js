import prompt from 'prompt'
import { parser } from 'tickbin-parser'
import db from '../db'
import { writeSaved } from './output'
import { commitTimer } from '../timers'

export default { builder, handler : stop}

function builder(yargs) {
  return yargs
  .usage('Usage: tick stop')
  .example('tick stop', 'stop timer for the current time')
  .example('tick stop "10am"', 'stop timer for 10am')
  .example('tick stop "10am creating bugs #dev"', 'stop timer for 10am and provide new commit message')
}

function stop(argv) {
  const message = argv._[1]

  let timersDoc

  db.get('_local/timers')
  .then(td => {
    timersDoc = td
    return timersDoc.timers.pop()
  })
  .then(timer => ensureEndAndMessage(timer, message))
  .then(timer => db.put(timersDoc).then(() => timer))
  .then(timer => commitTimer(db, timer))
  .then(writeSaved)
  .catch(err => console.error(`Could not stop your timer\n${err.message}`))
}

/*
 * Recursive function to ensure user provides both an end time and message
 *
 * This is complicated as the user can input in several different ways and
 * orders. As well as being able to cancel at any time which should result in
 * the timer remaining in the couch document.
 */
function ensureEndAndMessage(timer, newMessage) {
  if (!newMessage && !timer.message) {
    return promptForMessage()
    .then(message => ensureEndAndMessage(timer, message))
  } else if (newMessage) {
    const { start: end, message } = parser(newMessage)

    timer.end = end || timer.end || new Date()

    if (!message && !timer.message) {
      return promptForMessage()
      .then(m => ensureEndAndMessage(timer, m))
    } else {
      timer.message = message || timer.message
      return timer
    }
  } else {
    timer.end = new Date()

    return timer
  }
}

function promptForMessage(prevEnd) {
  return new Promise((resolve, reject) => {
    prompt.message = ''
    prompt.delimiter = ''
    prompt.start()
    prompt.get('message', (err, res) => {
      if (err && err.message === 'canceled')
        return reject(new Error('You canceled the stop command'))

      if (err)
        return reject(err)

      resolve(res.message)
    })
  })
}

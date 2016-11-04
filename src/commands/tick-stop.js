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
    //  We are hoping to support multiple timers in the future, which is why we
    //  are popping off an array here.
    return timersDoc.timers.pop()
  })
  .then(timer => ensureEndAndMessage(timer, message))
  .then(timer => db.put(timersDoc).then(() => timer)) // Persist the timer pop
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
 *
 * Since we don't have tests for our commands, I will try to list the different
 * cases:
 *
 * 1. Timer already has a message.
 *   a. User provides an end time with the stop command
 *      * Parse the end time from the new message
 *   b. User provides a new commit message with no time
 *      * Use current time for end
 *      * Update message
 *   c. User provides end time and message with stop command
 *      * Use provided end time
 *      * Update message
 *   d. User does not provide a message with the stop command
 *      * Use current time for end
 * 2. Timer does not have a message
 *   a. User provides an end time with the stop command
 *      aa. Prompt user and they provide a message
 *          * Set message
 *          * Use originally stated end time
 *      ab. Prompt user and they provide a message and new end time
 *          * Set message
 *          * Use new end time
 *      ac. Prompt user and they only provide a new end time
 *          * Update end time
 *          * Prompt again for message
 *   b. User provides message but no end time
 *      * Set message
 *      * User current time
 *   c. User does not provide a message with the stop command
 *      ca. Prompt user and they provide a message
 *          * Set message
 *          * Use current time for end
 *      cb. Prompt user and they provide an end time
 *          * Update end time
 *          * Prompt again for message
 *      cc. Prompt user and they provide end time and message
 *          * Set end time
 *          * Set message
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

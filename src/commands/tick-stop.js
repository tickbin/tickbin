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

  db.get('_local/timers')
  .then(timersDoc => parseMessage(timersDoc, message))
  .then(timer => commitTimer(db, timer))
  .then(writeSaved)
  .catch(err => console.error(`Could not stop your timer\n${err.message}`))
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

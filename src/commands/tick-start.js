import { parser } from 'tickbin-parser'
import { writeSavedTimer } from './output'
import db from '../db'

export default { builder, handler : start}

const defTimersDoc = {
  _id: '_local/timers',
  timers: []
}

function builder(yargs) {
  return yargs
  .usage('Usage: tick start [message]')
  .example('tick start', 'start a timer for the current time')
  .example('tick start "8am"', 'start a timer for 8am')
  .example('tick start "8am squashing bugs #dev"', 'start a timer for 8am and provide a message for the commit')
}

function start(argv) {
  const message = argv._[1]

  db.get('_local/timers')
  .then(timersDoc => saveTimer(timersDoc, message))
  .catch(err => {
    //  If the timersDoc doesn't exist, pass the defTimersDoc
    if (err.name === 'not_found')
      return saveTimer(defTimersDoc, message)
    else
      throw err
  })
  .then(writeSavedTimer)
  .catch(err => console.error(`Could not start your timer\n${err.message}`))
}

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

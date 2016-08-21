import { writeSavedTimer } from './output'
import db from '../db'
import { saveTimer } from '../timers'

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
  .then(timersDoc => saveTimer(db, timersDoc, message))
  .catch(err => {
    //  If the timersDoc doesn't exist, pass the defTimersDoc
    if (err.name === 'not_found')
      return saveTimer(db, defTimersDoc, message)
    else
      throw err
  })
  .then(writeSavedTimer)
  .catch(err => console.error(`Could not start your timer\n${err.message}`))
}

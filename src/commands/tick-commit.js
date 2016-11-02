import prompt from 'prompt'
import chrono from 'chrono-node'
import { writeSaved } from './output'
import createEntry from '../create'
import db from '../db'

export default { builder, handler : commit }

function builder(yargs) {
  return yargs
  .usage('Usage: tick commit [options] [message]')
  .example('tick commit "8am-12pm fixing bugs #tickbin"', 'record work for current day')
  .example('tick commit "Jan 22 11am-1pm fixing bugs #tickbin"', 'record work for Jan 22')
  .example('tick commit "yesterday 4-5pm learning javascript #dev"', 'record work for yesterday')
  .example('tick commit "4 hours 15 minutes no specific time"', 'record duration with no start/end')
  .option('m', {
    alias: 'message',
    describe: 'message for your time entry',
    type: 'string'
  })
}

function commit(argv) {
  let message

  if (argv.message)
    message = argv.message

  if (!message && argv._[1]) {
    message = argv._[1]
  }

  if (!message) {
    prompt.message = ''
    prompt.delimiter = ''
    prompt.start()
    prompt.get('message', (err, res) => {
      if (err && err.message === 'canceled')
        return console.log('\nCanceled. Nothing to save.')

      if (err) 
        throw err

      createEntry(db, res.message)
      .then(writeSaved)
    })
  } else {
    createEntry(db, message)
    .then(writeSaved)
  }
}

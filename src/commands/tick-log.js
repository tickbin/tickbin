export default log

import Entry from '../entry'
import prompt from 'prompt'
import chrono from 'chrono-node'
import {write} from './output'
import chalk from 'chalk'
import db from '../db'

function log (yargs) {
  let argv = yargs
  .usage('Usage: tick log [options] [message]')
  .option('d', {
    alias: 'date',
    describe: 'date for tick'
  })
  .option('m', {
    alias: 'message',
    describe: 'entry message. E.g. 8am-12pm fixing bugs #tickbin'
  })
  .help('h')
  .alias('h', 'help')
  .argv

  let {message, date} = argv
  date = chrono.parseDate(date)

  if (argv._[1] && !message) {
    message = argv._[1]
  }

  if (!message) {
    prompt.message = ''
    prompt.delimiter = ''
    prompt.start()
    prompt.get('message', function(err, res) {
      if (!err) createEntry(res.message, {date}) 
    })
  } else {
    createEntry(message, {date}) 
  }
}

function createEntry (message, opts = {}) {
  let entry = new Entry(message, opts)

  if (!entry.duration) {
    console.error(chalk.bgRed('error'), 'You must specify a time in your message. E.g. 8am-12pm')
    return
  }

  db.put(entry.toJSON())
  .then(doc => {
    console.log(chalk.bgGreen('saved'))
    write(entry)
  })
  .catch(err => {
    console.error(chalk.bgRed('error'), err)
  })
}


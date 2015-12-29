export default log

import Entry from '../entry'
import prompt from 'prompt'
import PouchDB from 'pouchdb'
import chrono from 'chrono-node'
import {write} from './output'
import chalk from 'chalk'
import conf from '../config'

let db = new PouchDB(conf.db)

function log (yargs) {
  let argv = yargs
  .usage('Usage: tick log [options]')
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

  if (!message) {
    prompt.message = ''
    prompt.delimiter = ''
    prompt.start()
    prompt.get('message:', function(err, res) {
      if (!err) createEntry(res.message, {date}) 
    })
  } else {
    createEntry(message, {date}) 
  }
}

function createEntry (message, opts = {}) {
  let entry = new Entry(message, opts)

  db.put(entry.toJSON())
  .then(doc => {
    console.log(chalk.bgGreen('saved'))
    write(entry)
  })
  .catch(err => {
    console.error(err)
  })

}

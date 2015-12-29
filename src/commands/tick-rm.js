export default rm

import Entry from '../entry'
import PouchDB from 'pouchdb'
import {write} from './output'
import chalk from 'chalk'
import conf from '../config'

let db = new PouchDB(conf.db)

function rm (yargs) {
  let argv = yargs
  .usage('Usage: tick rm [options] <entryid ...>')
  .help('h')
  .alias('h', 'help')
  .argv

  db.get(argv._[1])
  .then(removeEntry)
}

function removeEntry (doc) {
  const e = Entry.fromJSON(doc)
  write(e)
  return db.remove(doc).then(result => { console.log(chalk.bgRed('removed')) })
}

export default rm

import Entry from '../entry'
import { getOutputs } from './output'
import chalk from 'chalk'
import db from '../db'

function rm (yargs) {
  let argv = yargs
  .usage('Usage: tick rm [options] <entryid ...>')
  .help('h')
  .alias('h', 'help')
  .argv

  argv._.shift()
  argv._.forEach(id => {
    db.get(id).then(removeEntry)
  })
}

function removeEntry (doc) {
  const e = Entry.fromJSON(doc)
  return db.remove(doc).then(result => { 
    let { detailed } = getOutputs(e)
    console.log(chalk.bgRed('removed') + ' ' + detailed)
  })
}

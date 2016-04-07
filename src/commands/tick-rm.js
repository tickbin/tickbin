import { writeRemove } from './output'
import removeEntries from '../remove'
import db from '../db'

function builder(yargs) {
  return yargs
  .usage('Usage: tick rm [options] <entryid ...>')
  .help('h')
  .alias('h', 'help')
}

function rm(argv) {
  argv._.shift()
  removeEntries(db, argv._)
  .then(docs => {
    docs.forEach(writeRemove)
  })
}

export default { builder, handler : rm }

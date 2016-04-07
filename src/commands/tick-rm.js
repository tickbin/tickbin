import { writeRemove } from './output'
import removeEntries from '../remove'
import db from '../db'

export default { builder, handler : rm }

function builder(yargs) {
  return yargs
  .usage('Usage: tick rm [options] <entryid ...>')
}

function rm(argv) {
  argv._.shift()
  removeEntries(db, argv._)
  .then(docs => {
    docs.forEach(writeRemove)
  })
}

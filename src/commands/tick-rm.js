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
  if (argv._.length == 0) {
    console.warn('No remove ID provided. Look for one in your \'tick log\'.')
  }
  removeEntries(db, argv._)
  .then(docs => {
    docs.forEach(writeRemove)
  })
}

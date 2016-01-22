import { writeRemove } from './output'
import { removeEntries } from '../remove'
import db from '../db'

export default rm

function rm (yargs) {
  let argv = yargs
  .usage('Usage: tick rm [options] <entryid ...>')
  .help('h')
  .alias('h', 'help')
  .argv

  argv._.shift()
  removeEntries(db, argv._)
  .then(docs => {
    docs.forEach(writeRemove)
  })
}

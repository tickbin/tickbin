export default rm

import { removeEntries } from '../remove'
import db from '../db'

function rm (yargs) {
  let argv = yargs
  .usage('Usage: tick rm [options] <entryid ...>')
  .help('h')
  .alias('h', 'help')
  .argv

  argv._.shift()
  removeEntries(db, argv._)
}

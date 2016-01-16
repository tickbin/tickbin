export default upgrade

import chalk from 'chalk'
import db from '../db'
import createEntryIndex from '../db/designEntryIndex'

function upgrade (yargs) {
  let argv = yargs
  .usage('Usage: tick upgrade')
  .help('h')
  .alias('h', 'help')
  .argv

  createEntryIndex(db)
  .then( () => console.log('index ensured'))
}

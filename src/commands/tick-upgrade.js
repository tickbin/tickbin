import chalk from 'chalk'
import db from '../db'
import createEntryIndex from '../db/designEntryIndex'
import upgrader from '../upgrade'

function builder(yargs) {
  return yargs
  .usage('Usage: tick upgrade')
  .alias('h', 'help')
  .help()
}

function upgrade(argv) {
  createEntryIndex(db)
  .then( () => console.log('index ensured'))
  .then( () => upgrader(db) )
  .then( res => console.log(`updated ${res.length} documents`))
}

export default { builder, handler : upgrade }

import chalk from 'chalk'
import db from '../db'
import createEntryIndex from '../db/designEntryIndex'
import upgrader from '../upgrade'

export default { builder, handler : upgrade }

function builder(yargs) {
  return yargs
  .usage('Usage: tick upgrade')
}

function upgrade(argv) {
  createEntryIndex(db)
  .then( () => console.log('index ensured'))
  .then( () => upgrader(db) )
  .then( res => console.log(`updated ${res.length} documents`))
}

export default upgrade

import chalk from 'chalk'
import db from '../db'
import createEntryIndex from '../db/designEntryIndex'
import Entry from '../entry'
import _ from 'lodash'
import moment from 'moment'
import upgrader from '../upgrade'

function upgrade (yargs) {
  let argv = yargs
  .usage('Usage: tick upgrade')
  .help('h')
  .alias('h', 'help')
  .argv

  createEntryIndex(db)
  .then( () => console.log('index ensured'))
  .then( () => upgrader(db) )
  .then( res => console.log(`updated ${res.length} documents`))
}

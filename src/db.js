
import PouchDB from 'pouchdb'
import chalk from 'chalk'
import conf from './config'
import createEntryIndex from './db/designEntryIndex'
import find from 'pouchdb-find'

PouchDB.plugin(find)
const db = new PouchDB(conf.db)
export default db

db.on('created', createEntryIndex)

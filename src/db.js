
import PouchDB from 'pouchdb'
import chalk from 'chalk'
import conf from './config'

const db = new PouchDB(conf.db)
if (conf.remote) sync(db, conf.remote)
export default db

db.on('created', createIndex)

function createIndex (dbName) {
  const ddoc = {
    _id: '_design/entry_index',
    views: {
      by_from: {
        map: mapFrom.toString()
      } 
    }
  } 

  return db.put(ddoc)
}

function mapFrom (doc) {
  emit(doc.fromArr)
}

function sync(src, dst) {
  PouchDB.sync(src, dst)
  .on('denied', handleErr)
  .on('error', handleErr)
}

function handleErr(err) {
  let msg = 'Could not sync with remote CouchDB:'
  console.error(chalk.bgRed('error'), msg, err.message)
}

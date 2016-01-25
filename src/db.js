
import PouchDB from 'pouchdb'
import chalk from 'chalk'
import conf from './config'
import createEntryIndex from './db/designEntryIndex'

const db = new PouchDB(conf.db)
if (conf.remote) sync(db, conf.remote)
export default db

db.on('created', createEntryIndex)

function sync(db, dst) {
  getLastSync(db)
  .then(lastSync => {
    const opts = {
      push: { since: lastSync.push.last_seq },
      pull: { since: lastSync.pull.last_seq }
    }
    db.sync(dst, opts)
    .on('denied', handleErr)
    .on('error', handleErr)
    .on('complete', info => {
      updateLastSync(db, lastSync, info)
    })
  })
}

function getLastSync(db) {
  const lastSync = {
    _id: '_local/last_sync',
    push: { last_seq: null },
    pull: { last_seq: null } 
  }

  return db.get(lastSync._id)
  .then(doc => {
    return doc
  }, () => {
    return db.put(lastSync).then(() => db.get(lastSync._id))  
  })
}

function updateLasySync(db, lastSync, info) {
  lastSync.push.last_seq = info.push.last_seq
  lastSync.pull.last_seq = info.pull.last_seq
  return db.put(lastSync) 
}

function handleErr(err) {
  let msg = 'Could not sync with remote CouchDB:'
  console.error(chalk.bgRed('error'), msg, err.message)
}

export { getLastSync as _getLastSync }
export { updateLastSync as _updateLastSync }

export default class Sync {
  constructor (db, dst) {
    if (!db) throw new Error('Please provide a couchdb instance')
    if (!dst) throw new Error('Please provide a destination')
  }
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

function updateLastSync(db, lastSync, info) {
  lastSync.push.last_seq = info.push.last_seq
  lastSync.pull.last_seq = info.pull.last_seq
  return db.put(lastSync) 
}

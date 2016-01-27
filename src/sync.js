export { getLastSync as _getLastSync }
export { updateLastSync as _updateLastSync }

export default class TickSyncer {
  constructor (db, remote) {
    if (!db) throw new Error('Please provide a couchdb instance')
    if (!remote) throw new Error('Please provide a remote destination')

    this.db = db
    this.remote = remote
    this._promiseLastSync = this.getLastSync()
  }

  getLastSync() {
    const lastSync = {
      _id: '_local/last_sync',
      push: { last_seq: null },
      pull: { last_seq: null } 
    }

    return this.db.get(lastSync._id)
    .then(doc => {
      return doc
    }, () => {
      return this.db.put(lastSync).then(() => this.db.get(lastSync._id))  
    })
  }

  sync() {
    return this._promiseLastSync.then(last_sync => {
      const opts = {
        push: { since: last_sync.push.last_seq },
        pull: { since: last_sync.pull.last_seq }
      }
      return this.db.sync(this.remote, opts) 
    })
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

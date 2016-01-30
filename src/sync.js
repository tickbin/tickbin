import EventEmitter from 'events'
import forward from 'forward-events'

export default sync

function sync (db, remote) {
  if (!db) throw new Error('Please provide a couchdb instance')
  if (!remote) throw new Error('Please provide a remote destination')

  const lastSync = {
    _id: '_local/last_sync',
    push: { last_seq: null },
    pull: { last_seq: null } 
  }
  const evt = new EventEmitter()
  db.get(lastSync._id)
  .then(doc => doc, () => {
    return db.put(lastSync).then(() => db.get(lastSync._id)) 
  })
  .then(last_sync => {
    const opts = {
      push: { since: last_sync.push.last_seq },
      pull: { since: last_sync.pull.last_seq }
    }

    const syncEvt = db.sync(remote, opts)
    forward(syncEvt, evt) // forward all sync events
    syncEvt.on('complete', info => {
      last_sync.push.last_seq = info.push.last_seq
      last_sync.pull.last_seq = info.pull.last_seq
      db.put(last_sync)
    })
  })

  return evt
}

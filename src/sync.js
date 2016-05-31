export default sync

function sync (db, remote) {
  if (!db) throw new Error('Please provide a couchdb instance')
  if (!remote) throw new Error('Please provide a remote destination')

  const opts = {
    push: { since: 0 },
    pull: { since: 0 }
  }

  const evt = db.sync(remote, opts)

  return evt
}

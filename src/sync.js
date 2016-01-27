export default sync

export { getLastSync as _getLastSync }

function sync(db, dst) {
  if (!db) throw new Error('Please provide a couchdb instance')
  if (!dst) throw new Error('Please provide a destination')
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

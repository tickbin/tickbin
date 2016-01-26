export default sync

function sync(db, dst) {
  if (!db) throw new Error('Please provide a couchdb instance')
  if (!dst) throw new Error('Please provide a destination')
}

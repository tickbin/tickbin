import Entry from './entry'

export { createEntry }

function createEntry (db, message, opts = {}) {
  if (!db) throw new Error('Please provide a couchdb instance')
  if (!message) throw new Error('Please provide a message')

  let entry = new Entry(message, opts)

  if (!entry.duration) {
    console.error(chalk.bgRed('error'), 'You must specify a time in your message. E.g. 8am-12pm')
    return
  }

  const doc = entry.toJSON()
  return db.put(doc)
  .then(() => doc)
  .catch(err => {
    console.error(chalk.bgRed('error'), err)
  })
}

import Entry from './entry'
import chalk from 'chalk'

export default createEntry

function createEntry (db, message, opts = {}) {
  if (!db) throw new Error('Please provide a couchdb instance')
  if (!message) throw new Error('Please provide a message')

  let entry = new Entry(message, opts)

  if (!entry.duration) {
    const err = 'You must specify a time in your message.'
    console.error(chalk.bgRed('error'), err, 'E.g. 8am-12pm')
    return new Promise((resolve, reject) => reject(err))
  }

  const doc = entry.toJSON()
  return db.put(doc)
  .then(() => doc)
  .catch(err => {
    console.error(chalk.bgRed('error'), err)
  })
}

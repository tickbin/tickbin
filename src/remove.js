import Entry from './entry'
import chalk from 'chalk'
import { writeRemove } from './commands/output'

export { removeEntries }

function removeEntries (db, ids) {
  ids.forEach(id => {
    db.get(id)
    .then(doc => {
      return db.remove(doc)
      .then(() => doc)  //  Ensure doc is put back on chain
    })
    .then(doc => {
      const entry = Entry.fromJSON(doc)
      writeRemove(entry)
    })
    .catch(err => console.log(err))
  })
}

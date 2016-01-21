import Entry from './entry'
import chalk from 'chalk'
import { getOutputs } from './commands/output'

export { removeEntries }

function removeEntries (db, ids) {
  ids.forEach(id => {
    db.get(id)
    .then(doc => {
      return db.remove(doc)
      .then(() => doc)  //  Ensure doc is put back on chain
    })
    .then(doc => {
      const e = Entry.fromJSON(doc)
      let { detailed } = getOutputs(e)
      console.log(chalk.bgRed('removed') + ' ' + detailed)
    })
    .catch(err => console.log(err))
  })
}

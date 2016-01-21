import _ from 'lodash'
import Entry from './entry'
import chalk from 'chalk'
import { getOutputs } from './commands/output'

export { removeEntries }

function removeEntries (db, ids) {
  db.allDocs({ keys: ids, include_docs: true })
  .then(({ rows }) => {
    //  Fetch docs and mark as deleted
    var docs = _.chain(rows)
    .pluck('doc')
    .forEach(doc => doc._deleted = true)
    .value()

    //  Bulk delete form db
    return db.bulkDocs(docs)
    .then(() => docs)
  })
  .then(docs => {
    docs.forEach(doc => {
      const e = Entry.fromJSON(doc)
      let { detailed } = getOutputs(e)
      console.log(chalk.bgRed('removed') + ' ' + detailed)
    })
  })
  .catch(err => console.log(err));
}

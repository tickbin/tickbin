import _ from 'lodash'

export default removeEntries

function removeEntries (db, ids) {
  if (!db) throw new Error('Please provide a couchdb instance')
  if (!ids) throw new Error('Please provide an array of ids')

  return db.allDocs({ keys: ids, include_docs: true })
  .then(({ rows }) => {
    //  Mark all docs as deleted
    var docs = _.chain(rows)
    .pluck('doc')
    .forEach(doc => doc._deleted = true)
    .value()

    //  Bulk delete form db
    return db.bulkDocs(docs)
    .then(() => docs)
  })
  .catch(err => console.error(chalk.bgRed('error'), err))
}

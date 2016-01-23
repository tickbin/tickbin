import moment from 'moment'
import Entry from './entry'
import _ from 'lodash'

export { map0to1 }
export { map1to2 }

export default upgrade

function upgrade (db, start = 0, end = 1) {
  if (!db) throw new Error('Please provide a couchdb instance')

  return db.query('entry_index/by_version', {
    startkey: start,
    endkey: end,
    include_docs: true 
  })
  .then(res => {
    let newDocs = _.chain(res.rows)
      .pluck('doc')
      .map(map0to1)
      .map(map1to2)
      .value()
    return db.bulkDocs(newDocs)
  })
}

function map0to1 (doc) {
  if (doc.version >= 1)
    return doc

  const date = moment(doc.from).toDate()
  const e = new Entry(doc.message, { date })
  let newDoc = {}
  Object.assign(newDoc, doc)

  newDoc.version = e.version

  return newDoc 
}

function map1to2 (doc) {
  if (doc.version >= 2)
    return doc

  const date = moment(doc.from).toDate()
  const e = new Entry(doc.message, { date })
  let newDoc = {}
  Object.assign(newDoc, doc)

  newDoc.time = e.time
  newDoc.version = 2

  return newDoc
}

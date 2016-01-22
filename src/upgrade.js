import moment from 'moment'
import Entry from './entry'

export { map0to1 }
export { map1to2 }

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

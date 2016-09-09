import moment from 'moment'
import { Entry } from 'tickbin-parser'
import _ from 'lodash'

export { map0to1 }
export { map1to2 }
export { map2to3 }
export { map3to4 }
export { map4to5 }
export { map5to6 }
export { map6to7 }

export default upgrade

function upgrade (db, start = 0, end = 6) {
  if (!db) throw new Error('Please provide a couchdb instance')

  return db.find({
    selector: {
      version: { "$gte": start },
      version: { "$lte": end }
    }
  })
  .then(res => {
    let newDocs = _.chain(res.docs)
      .map(map0to1)
      .map(map1to2)
      .map(map2to3)
      .map(map3to4)
      .map(map4to5)
      .map(map5to6)
      .map(map6to7)
      .value()
    return db.bulkDocs(newDocs)
  })
  .catch(err => console.error(err))
}

function map0to1 (doc) {
  if (doc.version >= 1)
    return doc

  const date = moment(doc.from).toDate()
  const e = new Entry(doc.user, doc.message, { date })
  let newDoc = {}
  Object.assign(newDoc, doc)

  newDoc.version = 1 

  return newDoc 
}

function map1to2 (doc) {
  if (doc.version >= 2)
    return doc

  const date = moment(doc.from).toDate()
  const e = new Entry(doc.user, doc.message, { date })
  let newDoc = {}
  Object.assign(newDoc, doc)

  newDoc.time = e.time
  newDoc.version = 2

  return newDoc
}

function map2to3 (doc) {
  if (doc.version >= 3)
    return doc

  let newDoc = {}
  Object.assign(newDoc, doc)

  delete newDoc.from
  delete newDoc.fromArr
  delete newDoc.to
  delete newDoc.toArr

  newDoc.start    = doc.from
  newDoc.startArr = doc.fromArr
  newDoc.end      = doc.to
  newDoc.endArr   = doc.toArr
  newDoc.version  = 3

  return newDoc
}

function map3to4 (doc) {
  if (doc.version >= 4)
    return doc

  let newDoc = {}
  Object.assign(newDoc, doc)

  newDoc.ref = moment(doc.start).toDate()
  newDoc.version = 4

  return newDoc
}

function map4to5 (doc) {
  if (doc.version >= 5)
    return doc

  let newDoc = {}
  Object.assign(newDoc, doc)

  newDoc.startArr = moment(newDoc.start).utc().toArray()
  newDoc.endArr   = moment(newDoc.end).utc().toArray()
  newDoc.version = 5

  return newDoc
}

function map5to6 (doc) {
  if (doc.version >= 6)
    return doc

  const timePattern = new RegExp(/\s*/.source + doc.time + /\s*/.source, 'g')

  let newDoc = {}
  Object.assign(newDoc, doc)

  newDoc.original = newDoc.message
  newDoc.message = newDoc.message
  .replace(timePattern, ' ')
  .trim()
  newDoc.version = 6

  return newDoc
}

function map6to7 (doc) {
  if (doc.version >= 7)
    return doc

  let newDoc = {}
  Object.assign(newDoc, doc)

  if (!doc.createdFrom)
    newDoc.createdFrom = 'calendar'
  newDoc.version = 7

  return newDoc
}

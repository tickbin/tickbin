import test from 'tape'
import sinon from 'sinon'
import moment from 'moment'
import Entry from '../entry'
import { removeEntries } from '../remove'
import _ from 'lodash'
import { writeRemove } from '../commands/output'

const today = moment().toDate()
const yesterday = moment().subtract(1, 'day').toDate()
const rows = [
  { doc: new Entry('1pm-2pm work', { date: today }).toJSON()},
  { doc: new Entry('2pm-3pm work #tag', { date: today }).toJSON()},
  { doc: new Entry('1pm-2pm work', { date: yesterday }).toJSON()}
]

var fakeDb = {
  allDocs: function (options) {
    const filteredRows = _.filter(rows, row => {
      return options.keys.indexOf(row.doc._id) > -1
    })

    let p = new Promise((resolve, reject) => {
      resolve({ rows: filteredRows })
    })
    return p
  },
  bulkDocs: function (docs) {
    let p = new Promise((resolve, reject) => {
      resolve()
    })
    return p
  }
}

test('removeEntries requires a db', t => {
  function removeWithoutDb () {
    return removeEntries(null, [])
  }

  function removeWithDb () {
    return removeEntries(fakeDb, [])
  }

  t.plan(2)
  t.throws(removeWithoutDb, /provide a couchdb/, 'removeEntries requires a db')
  t.doesNotThrow(removeWithDb, 'removeEntries requires a db')
})

test('removeEntries requires an array of ids', t => {
  function removeWithoutArray () {
    return removeEntries(fakeDb)
  }

  function removeWithArray () {
    return removeEntries(fakeDb, [])
  }

  t.plan(2)
  t.throws(
    removeWithoutArray,
    /provide an array of ids/,
    'removeEntries requires an array of ids'
  )
  t.doesNotThrow(removeWithArray, 'removeEntries requires an array of ids')
})

test('removeEntries should return a promise', t => {
  let docIds = _.chain(rows).pluck('doc').pluck('_id').value()
  let res    = removeEntries(fakeDb, docIds)

  t.plan(1)
  t.ok(typeof res.then === 'function', 'removeEntries returns a promise')
})

test('removeEntries calls db.allDocs and db.bulkDocs', t => {
  const spyDbAllDocs  = sinon.spy(fakeDb, 'allDocs')
  const spyDbBulkDocs = sinon.spy(fakeDb, 'bulkDocs')

  let docIds = _.chain(rows).pluck('doc').pluck('_id').value()
  removeEntries(fakeDb, docIds).then(() => {
    t.plan(2)
    t.ok(spyDbAllDocs.calledOnce, 'called db.allDocs once')
    t.ok(spyDbBulkDocs.calledOnce, 'called db.bulkDocs once')
  })
})

test('removeEntries promise resolves to removed docs', t => {
  let docs   = _.pluck(rows, 'doc')
  let docIds = _.pluck(docs, '_id')

  removeEntries(fakeDb, docIds).then((removedDocs) => {
    t.plan(1)
    t.deepEqual(
      removedDocs,
      docs,
      'removeEntries promise resolves to removed docs'
    )
  })
})

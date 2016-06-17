import test from 'tape'
import sinon from 'sinon'
import promised from 'sinon-as-promised'
import moment from 'moment'
import Entry from 'tickbin-entry-parser'
import removeEntries from '../remove'
import _ from 'lodash'
import { writeRemove } from '../commands/output'

const today = moment().toDate()
const yesterday = moment().subtract(1, 'day').toDate()
const rows = [
  { doc: new Entry(undefined, '1pm-2pm work', { date: today }).toJSON()},
  { doc: new Entry(undefined, '2pm-3pm work #tag', { date: today }).toJSON()},
  { doc: new Entry(undefined, '1pm-2pm work', { date: yesterday }).toJSON()}
]

function getFakeDb() {
  return {
    allDocs: function () {},
    bulkDocs: function () {}
  }
}

test('removeEntries requires a db', t => {
  function removeWithoutDb () {
    return removeEntries(null, [])
  }

  t.plan(1)
  t.throws(removeWithoutDb, /provide a couchdb/, 'removeEntries requires a db')
})

test('removeEntries requires an array of ids', t => {
  function removeWithoutArray () {
    return removeEntries(getFakeDb())
  }

  t.plan(1)
  t.throws(
    removeWithoutArray,
    /provide an array of ids/,
    'removeEntries requires an array of ids'
  )
})

test('removeEntries should return a promise', t => {
  const fakeDb = getFakeDb()
  const stubAllDocs  = sinon.stub(fakeDb, 'allDocs').resolves({ rows })
  const stubBulkDocs = sinon.stub(fakeDb, 'bulkDocs').resolves()

  let docIds = _.chain(rows).map('doc').map('_id').value()
  let res    = removeEntries(fakeDb, docIds)

  t.plan(1)
  t.ok(typeof res.then === 'function', 'removeEntries returns a promise')
})

test('removeEntries calls db.allDocs and db.bulkDocs', t => {
  const fakeDb = getFakeDb()
  const stubAllDocs  = sinon.stub(fakeDb, 'allDocs').resolves({ rows })
  const stubBulkDocs = sinon.stub(fakeDb, 'bulkDocs').resolves()

  let docIds = _.chain(rows).map('doc').map('_id').value()
  removeEntries(fakeDb, docIds).then(() => {
    t.plan(2)
    t.ok(stubAllDocs.calledOnce, 'called db.allDocs once')
    t.ok(stubBulkDocs.calledOnce, 'called db.bulkDocs once')
  })
})

test('removeEntries promise resolves to removed docs', t => {
  const fakeDb = getFakeDb()
  const stubAllDocs  = sinon.stub(fakeDb, 'allDocs').resolves({ rows })
  const stubBulkDocs = sinon.stub(fakeDb, 'bulkDocs').resolves()

  let docs   = _.map(rows, 'doc')
  let docIds = _.map(docs, '_id')

  removeEntries(fakeDb, docIds).then((removedDocs) => {
    t.plan(1)
    t.deepEqual(
      removedDocs,
      docs,
      'removeEntries promise resolves to removed docs'
    )
  })
})

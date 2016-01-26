import test from 'tape'
import sinon from 'sinon'
import promised from 'sinon-as-promised'
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

let fakeDb = {
  allDocs: function () {},
  bulkDocs: function () {}
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
    return removeEntries(fakeDb)
  }

  t.plan(1)
  t.throws(
    removeWithoutArray,
    /provide an array of ids/,
    'removeEntries requires an array of ids'
  )
})

test('removeEntries should return a promise', t => {
  const sandbox = sinon.sandbox.create()

  const stubAllDocs  = sandbox.stub(fakeDb, 'allDocs').resolves({ rows })
  const stubBulkDocs = sandbox.stub(fakeDb, 'bulkDocs').resolves()

  let docIds = _.chain(rows).pluck('doc').pluck('_id').value()
  let res    = removeEntries(fakeDb, docIds)

  t.plan(1)
  t.ok(typeof res.then === 'function', 'removeEntries returns a promise')

  res.then(() => sandbox.restore())
})

test('removeEntries calls db.allDocs and db.bulkDocs', t => {
  const sandbox = sinon.sandbox.create()

  const stubAllDocs  = sandbox.stub(fakeDb, 'allDocs').resolves({ rows })
  const stubBulkDocs = sandbox.stub(fakeDb, 'bulkDocs').resolves()

  let docIds = _.chain(rows).pluck('doc').pluck('_id').value()
  removeEntries(fakeDb, docIds).then(() => {
    t.plan(2)
    t.ok(stubAllDocs.calledOnce, 'called db.allDocs once')
    t.ok(stubBulkDocs.calledOnce, 'called db.bulkDocs once')
  })
  .then(() => sandbox.restore())
})

test('removeEntries promise resolves to removed docs', t => {
  const sandbox = sinon.sandbox.create()

  const stubAllDocs  = sandbox.stub(fakeDb, 'allDocs').resolves({ rows })
  const stubBulkDocs = sandbox.stub(fakeDb, 'bulkDocs').resolves()

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
  .then(() => sandbox.restore())
})

import test from 'tape'
import moment from 'moment'
import _ from 'lodash'
import Entry from '../entry'
import sinon from 'sinon'

import { filterTags } from '../query'
import { hashTags } from '../query'
import { parseDateRange } from '../query'
import { groupEntries } from '../query'
import Query from '../query'

const today = moment().toDate()
const yesterday = moment().subtract(1, 'day').toDate()
const rows = [
  { doc: new Entry('1pm-2pm work', { date: today }).toJSON()},
  { doc: new Entry('2pm-3pm work #tag', { date: today }).toJSON()},
  { doc: new Entry('1pm-2pm work', { date: yesterday }).toJSON()}
]
var fakeDb = {
  query: function () {
    let p = new Promise((resolve, reject) => {
      resolve({ rows }) 
    })
    return p 
  } 
}

test('new Query requires a db', t => {
  function makeQueryWithoutDb () {
    return new Query() 
  }

  function makeQueryWithDb() {
    return new Query(fakeDb) 
  }

  t.plan(2)
  t.throws(makeQueryWithoutDb, /provide a couchdb/, 'Query requires a db')
  t.doesNotThrow(makeQueryWithDb, 'Query requires a db')
})

test('query functions are fluent', t => {
  const q = new Query(fakeDb)

  t.plan(2)
  t.equals(q.findEntries(), q, 'findEntries returns the query')
  t.equals(q.groupByDate(), q, 'groupByDate returns the query')
})

test('findEntries() prepares the query', t => {
  const q = new Query(fakeDb)
  const start = moment().startOf('day').toArray() 
  const end = moment().endOf('day').toArray() 
  const tags = ['a']
  q.findEntries({ start, end, tags })
  const qOpts = q._queryOpts

  t.plan(4)
  t.ok(qOpts.descending, 'return results descending')
  t.ok(qOpts.include_docs, 'include the docs in results')
  t.equals(qOpts.startkey, end, 'startkey is the end date')
  t.equals(qOpts.endkey, start, 'endkey is the start date')
})

test('exec() returns a promise', t => {
  const q = new Query(fakeDb)
  const res = q.exec()

  t.plan(1)
  t.ok(typeof res.then === 'function', 'exec returns a promise')
})

test('exec() triggers executed flag', t => {
  const q = new Query(fakeDb)

  t.plan(3)
  t.notOk(q.isExecuted, 'query has not yet been executed')
  q.exec()
  t.ok(q.isExecuted, 'query has been executed')
  t.throws(q.exec.bind(q), /already been executed/, 'calling exec() again throws error')
})

test('exec() calls query with prepared query options', t => {
  const spy = sinon.spy(fakeDb, 'query')
  const q = new Query(fakeDb)
  q.exec()
  const qOpts = q._queryOpts

  t.plan(3)
  t.ok(spy.calledOnce)
  t.equals(spy.getCall(0).args[0], 'entry_index/by_from', 'query agains index')
  t.equals(spy.getCall(0).args[1], qOpts, 'calls db.query with prepared options')
})

test('findEntries().exec() returns array of entries', t => {
  const today = moment().startOf('day').toArray()
  const yesterday = moment().endOf('day').toArray()

  t.plan(2)
  new Query(fakeDb)
    .findEntries({ start: today, end: yesterday })
    .exec()
    .then(entries => {
      t.equals(entries.length, 3, 'should only return three') 
      t.equals(entries[0].message, '1pm-2pm work', 'entries are on the list')
    })
})

test('findEntries().exec() filters by tag', t => {
  const today = moment().startOf('day').toArray()
  const yesterday = moment().endOf('day').toArray()

  t.plan(2)
  new Query(fakeDb)
    .findEntries({ start: today, end: yesterday, tags: ['tag']})
    .exec()
    .then(entries => {
      t.equals(entries.length, 1, 'there is only one entry tagged')
      t.equals(entries[0].message, '2pm-3pm work #tag', 'check entry is tagged')
    })
})

test('findEntries().groupByDate().exec() returns expected entries', t => {
  const today = moment().startOf('day').toArray()
  const yesterday = moment().endOf('day').toArray()
  
  t.plan(4)
  new Query(fakeDb)
    .findEntries({ start: today, end: yesterday })
    .groupByDate()
    .exec()
    .then(groups => {
      t.equals(groups[0].ticks.length, 2, 'today has 2 entries')
      t.equals(groups[0].minutes, 120, 'today has 2 hours')
      t.equals(groups[1].ticks.length, 1, 'tomorrow has 1 entry')
      t.equals(groups[1].minutes, 60, 'today has 1 hour')
    })
})

test('filterTags() finds tags in source using AND', t => {
  const doc = { tags: ['a', 'b', 'c', 'd'] }
  t.ok(filterTags(['a'], doc), 'finds single tag')
  t.ok(filterTags(['a', 'b'], doc), 'finds multiple tags')
  t.notOk(filterTags(['x'], doc), 'does not find single tag')
  t.notOk(filterTags(['a', 'x'], doc), 'does not find multiple tags')

  t.end()
})

test('hashTags() prepends # to tags', t => {
  t.deepEquals(hashTags(['a']), ['#a'], 'prepends # to single tag')
  t.deepEquals(hashTags(['#a']), ['#a'], 'does not prepend if # already exists')
  t.deepEquals(hashTags(['#a', 'b']), ['#a', '#b'], 'prepends only tags without #')

  t.end()
})

test('parseDateRange() returns start and end date', t => {

  const { start, end } = parseDateRange('Jan 1-31')

  t.equals(start.getMonth(), 0, 'start month is Jan')
  t.equals(start.getDate(), 1, 'start day is 1')
  t.equals(end.getMonth(), 0, 'end month is Jan')
  t.equals(end.getDate(), 31, 'end day is 31')

  t.end()
})

test('parseDateRange() supports integers', t => {
  const { start, end } = parseDateRange('2')
  const before = moment().subtract(2, 'days')
  const today = moment()

  t.ok(before.isSame(start, 'day'), 'start is 2 days ago')
  t.ok(today.isSame(end, 'day'), 'end is today')
  
  t.end()
})

test('parseDateRange() defaults to 6 days prior', t => {
  const { start, end } = parseDateRange()
  const before = moment().subtract(6, 'days')
  const today = moment()

  t.ok(before.isSame(start, 'day'), 'start is 6 days ago')
  t.ok(today.isSame(end, 'day'), 'end is today')
  
  t.end()
})

import test from 'tape'
import moment from 'moment'
import _ from 'lodash'
import Entry from '../entry'
import sinon from 'sinon'
import promised from 'sinon-as-promised'

import { filterTags } from '../query'
import { hashTags } from '../query'
import { parseDateRange } from '../query'
import { groupEntries } from '../query'
import Query from '../query'
import compileFilter from 'tickbin-filter-parser'

const today = moment().toDate()
const yesterday = moment().subtract(1, 'day').toDate()
const march = moment(new Date('2015-03-15')).toDate()
const april = moment(new Date('2015-04-15')).toDate()
const results = { rows:[
  { doc: new Entry('1pm-2pm work', { date: today }).toJSON()},
  { doc: new Entry('2pm-3pm work #tag', { date: today }).toJSON()},
  { doc: new Entry('1pm-2pm work', { date: yesterday }).toJSON()},
  { doc: new Entry('1pm-2pm work in March', { date: march }).toJSON()},
  { doc: new Entry('1pm-2pm work in April', { date: april }).toJSON()}
]}

function getFakeDb() {
  return {
    query: function() {}
  }
}

test('new Query requires a db', t => {
  function makeQueryWithoutDb () {
    return new Query() 
  }

  function makeQueryWithDb() {
    return new Query(getFakeDb()) 
  }

  t.plan(2)
  t.throws(makeQueryWithoutDb, /provide a couchdb/, 'Query requires a db')
  t.doesNotThrow(makeQueryWithDb, 'Query requires a db')
})

test('query functions are fluent', t => {
  const q = new Query(getFakeDb())

  t.plan(2)
  t.equals(q.findEntries(), q, 'findEntries returns the query')
  t.equals(q.groupByDate(), q, 'groupByDate returns the query')
})

test('findEntries() prepares the query', t => {
  const q = new Query(getFakeDb)
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

test('findEntries() accepts filter OR start, end, tags', t => {
  const q = new Query(getFakeDb)
  const start = moment().startOf('day').toArray()
  const end = moment().endOf('day').toArray()
  const tags = ['a']
  const filter = function() {}

  function findEverything () {
    q.findEntries({start, end, tags, filter}) 
  }

  function findFilterOnly () {
    q.findEntries({filter}) 
  }

  function findStartEndTags () {
    q.findEntries({start, end, tags}) 
  }

  t.plan(3)
  t.throws(findEverything, 'do not call with start, end, tags AND filter')
  t.doesNotThrow(findFilterOnly, 'you can call with just filter')
  t.doesNotThrow(findStartEndTags, 'you can call with just start, end, tags')
})

test('exec() returns a promise', t => {
  const fakeDb = getFakeDb()
  const stub = sinon.stub(fakeDb, 'query').resolves(results)
  const q = new Query(fakeDb)
  const res = q.exec()

  t.plan(1)
  t.ok(typeof res.then === 'function', 'exec returns a promise')
})

test('exec() triggers executed flag', t => {
  const fakeDb = getFakeDb()
  const stub = sinon.stub(fakeDb, 'query').resolves(results)
  const q = new Query(fakeDb)

  t.plan(3)
  t.notOk(q.isExecuted, 'query has not yet been executed')
  q.exec()
  t.ok(q.isExecuted, 'query has been executed')
  t.throws(q.exec.bind(q), /already been executed/, 'calling exec() again throws error')
})

test('exec() calls query with prepared query options', t => {
  const fakeDb = getFakeDb()
  const stub = sinon.stub(fakeDb, 'query').resolves(results)
  const q = new Query(fakeDb)
  q.exec()
  const qOpts = q._queryOpts

  t.plan(3)
  t.ok(stub.calledOnce, 'query is called once')
  t.equals(stub.getCall(0).args[0], 'entry_index/by_start', 'query agains index')
  t.equals(stub.getCall(0).args[1], qOpts, 'calls db.query with prepared options')
})

test('findEntries().exec() returns array of entries', t => {
  const fakeDb = getFakeDb()
  const stub = sinon.stub(fakeDb, 'query').resolves(results)
  const today = moment().startOf('day').toArray()
  const yesterday = moment().endOf('day').toArray()

  t.plan(2)
  new Query(fakeDb)
    .findEntries({ start: today, end: yesterday })
    .exec()
    .then(entries => {
      t.equals(entries[0].message, '1pm-2pm work', 'entries are on the list')
      t.ok(entries[0].duration.from, 'docs are converted to entry objects')
    })
})

test('findEntries().exec() filters by tag', t => {
  const fakeDb = getFakeDb()
  const stub = sinon.stub(fakeDb, 'query').resolves(results)
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

test('findEntries().exec() filters by filter function', t => {
  const fakeDb = getFakeDb()
  const stub = sinon.stub(fakeDb, 'query').resolves(results)
  const filter = compileFilter('#tag')

  t.plan(2)
  new Query(fakeDb)
    .findEntries({filter})
    .exec()
    .then(entries => {
      t.equals(entries.length, 1, 'there is only one entry tagged #tag') 
      t.equals(entries[0].message, '2pm-3pm work #tag', 'check entry is tagged')
    })
})

test('findEntries().exec() filters by date function', t => {
  const fakeDb = getFakeDb()
  const stub = sinon.stub(fakeDb, 'query').resolves(results)
  const filter = compileFilter('March 1 2015 - March 31 2015')

  t.plan(2)
  new Query(fakeDb)
    .findEntries({filter})
    .exec()
    .then(entries => {
      t.equals(entries.length, 1, 'there is only one entry in Mar 2015') 
      t.equals(entries[0].message, '1pm-2pm work in March', 'check entry is from march')
    })
})


test('findEntries().groupByDate().exec() returns expected entries', t => {
  const fakeDb = getFakeDb()
  const stub = sinon.stub(fakeDb, 'query').resolves(results)
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

test('filterTags() finds tags in source using OR', t => {
  const doc = { tags: ['a', 'b', 'c', 'd'] }
  t.ok(filterTags(['a'], doc), 'finds single tag')
  t.ok(filterTags(['a', 'b'], doc), 'finds multiple tags')
  t.ok(filterTags(['a', 'x'], doc), 'finds one of multiple tags')
  t.notOk(filterTags(['x'], doc), 'does not find single tag')
  t.notOk(filterTags(['x', 'y'], doc), 'does not find multiple tags')

  t.end()
})

test('filterTags() returns true if no tags provided', t => {
  const doc = { tags: ['a', 'b', 'c', 'd'] }
  t.ok(filterTags(undefined, doc))
  t.ok(filterTags([], doc))
  t.ok(filterTags(null, doc))
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

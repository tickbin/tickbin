import test from 'tape'
import moment from 'moment'
import _ from 'lodash'
import { Entry } from 'tickbin-parser'
import sinon from 'sinon'

import { filterTags } from '../query'
import { hashTags } from '../query'
import { parseDateRange } from '../query'
import { groupEntries } from '../query'
import Query from '../query'
import compileFilter from 'tickbin-filter-parser'

const today = moment().toDate()
const yesterday = moment().subtract(1, 'day').toDate()
const march = moment(new Date('2016-03-15')).toDate()
const april = moment(new Date('2016-04-15')).toDate()
const results = { docs: [
  new Entry(undefined, '1pm-2pm work', { date: today }).toObject(),
  new Entry(undefined, '2pm-3pm work #tag', { date: today }).toObject(),
  new Entry(undefined, '1pm-2pm work', { date: yesterday }).toObject(),
  new Entry(undefined, '1pm-2pm work in March', { date: march }).toObject(),
  new Entry(undefined, '1pm-2pm work in April', { date: april }).toObject()
]}

function getFakeDb() {
  return {
    query: function() {},
    find: function() {}
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
  const filter = "#a May 2016"
  q.findEntries(filter)
  const qFind = q._find
  const selector = { '$and': [
    {'tags': {'$elemMatch': {'$eq': '#a'}}},
    {'startArr': {'$gte': [2016,4,1,0,0,0,0]}},
    {'startArr': {'$lte': [2016,4,31,23,59,59,999]}} 
  ]}

  t.plan(2)
  t.deepEquals(qFind.sort, ['startArr'], 'always sort by startArr')
  t.deepEquals(qFind.selector, selector)
})

test('exec() returns a promise', t => {
  const fakeDb = getFakeDb()
  const stub = sinon.stub(fakeDb, 'find').resolves(results)
  const q = new Query(fakeDb)
  const res = q.exec()

  t.plan(1)
  t.ok(typeof res.then === 'function', 'exec returns a promise')
})

test('exec() triggers executed flag', t => {
  const fakeDb = getFakeDb()
  const stub = sinon.stub(fakeDb, 'find').resolves(results)
  const q = new Query(fakeDb)

  t.plan(3)
  t.notOk(q.isExecuted, 'query has not yet been executed')
  q.exec()
  t.ok(q.isExecuted, 'query has been executed')
  t.throws(() => q.exec(), /already been executed/, 'calling exec() again throws error')
})

test('exec() calls query with prepared query options', t => {
  const fakeDb = getFakeDb()
  const stub = sinon.stub(fakeDb, 'find').resolves(results)
  const q = new Query(fakeDb)
  q.exec()
  const qFind = q._findOpts

  t.plan(2)
  t.ok(stub.calledOnce, 'find is called once')
  t.equals(stub.getCall(0).args[0], qFind, 'calls db.find with prepared options')
})

test('findEntries().exec() returns array of entries', t => {
  const fakeDb = getFakeDb()
  const stub = sinon.stub(fakeDb, 'find').resolves(results)

  t.plan(2)
  new Query(fakeDb)
    .findEntries()
    .exec()
    .then(entries => {
      t.equals(entries[0].original, '1pm-2pm work', 'entries are on the list')
      t.ok(entries[0].duration.from, 'docs are converted to entry objects')
    })
})

test('findEntries().groupByDate().exec() returns expected entries', t => {
  const fakeDb = getFakeDb()
  const stub = sinon.stub(fakeDb, 'find').resolves(results)
  
  t.plan(4)
  new Query(fakeDb)
    .findEntries()
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

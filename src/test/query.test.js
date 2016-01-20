import test from 'tape'
import moment from 'moment'
import _ from 'lodash'
import Entry from '../entry'

import { filterTags } from '../query'
import { hashTags } from '../query'
import { parseDateRange } from '../query'
import { groupEntries } from '../query'
import Query from '../query'

var fakeDb = {
  query: function () {
    let p = new Promise((res, rej) => {
      res() 
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

test('exec() returns a promise', t => {
  const q = new Query(fakeDb)
  const res = q.exec()

  t.plan(1)
  t.ok(typeof res.then === 'function', 'exec returns a promise')
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

test('groupEntries() groups by date', t => {
  const today = moment().toDate() 
  const yesterday = moment().subtract(1, 'day').toDate() 
  const docs = [
    new Entry('1pm-2pm work', { date: today }).toJSON(),
    new Entry('2pm-3pm work', { date: today }).toJSON(),
    new Entry('1pm-2pm work', { date: yesterday }).toJSON()
  ]

  const groups = groupEntries(docs)
  t.equals(groups[0].ticks.length, 2, 'today has 2 entries')
  t.equals(groups[0].minutes, 120, 'today has 2 hours')
  t.equals(groups[1].ticks.length, 1, 'tomorrow has 1 entry')
  t.equals(groups[1].minutes, 60, 'today has 1 hour')

  t.end()
})

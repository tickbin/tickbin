import test from 'tape'
import moment from 'moment'

import { filterTags } from '../query'
import { hashTags } from '../query'
import { parseDateRange } from '../query'

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

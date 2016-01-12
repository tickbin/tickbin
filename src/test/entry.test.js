'use strict'
import test from 'tape'
import Entry from '../entry'
import moment from 'moment'

test('simple entry construction 8am-10pm', t => {
  const e = new Entry('8am-10am worked on things')
  const {from, to} = e.getDates()
  t.ok(e.hasDates, 'entry has dates')
  t.equals(e.message, '8am-10am worked on things')
  t.equals(from.getHours(), 8, 'from is 8am')
  t.equals(to.getHours(), 10, 'from is 10am')

  t.end()
})

test('simple entry construction 8am-5pm', t => {
  const e = new Entry('8am-5pm worked on things')
  const {from, to} = e.getDates()
  t.ok(e.hasDates, 'entry has dates')
  t.equals(e.message, '8am-5pm worked on things')
  t.equals(from.getHours(), 8, 'from is 8am')
  t.equals(to.getHours(), 17, 'to is 5pm')

  t.end()
})

test('no times specified does not generate dates', t => {
  const e = new Entry('worked on some things')
  const {from, to} = e.getDates()
  t.notOk(e.hasDates, 'flag indicates that no dates are present')
  t.notOk(from, 'no from date provided')
  t.notOk(to, 'no to date provided')

  t.end()
})

test('passing date influences the dates', t => {
  const date = new Date('Jan 25, 2015 0:00:00')
  const msg = '8am-5pm worked on some things'
  const e = new Entry(msg, {date})
  const {from, to} = e.getDates()
  t.equals(from.getFullYear(), 2015, 'from has the same year')
  t.equals(from.getMonth(), 0, 'from has same month')
  t.equals(from.getDate(), 25, 'from has same day')
  t.equals(to.getFullYear(), 2015, 'to has the same year')
  t.equals(to.getMonth(), 0, 'to has the same month')
  t.equals(to.getDate(), 25, 'to has the same day')

  t.end()
})

test('no date defaults to today', t => {
  const date = new Date()
  const msg = '8am-5pm worked on some things'
  const e = new Entry(msg)
  const {from,to} = e.getDates()

  t.equals(from.getFullYear(), date.getFullYear(), 'from year is today')
  t.equals(from.getMonth(), date.getMonth(), 'from month is today')
  t.equals(from.getDate(), date.getDate(), 'from date is today')
  t.equals(to.getFullYear(), date.getFullYear(), 'to year is today')
  t.equals(to.getMonth(), date.getMonth(), 'to month is today')
  t.equals(to.getDate(), date.getDate(), 'to date is today')

  t.end()
})

test('duration set for 8am-10am', t => {
  const e = new Entry('8am-10am worked on some things')
  
  t.ok(e.duration, 'duration is present')
  t.equals(e.duration.hour, 2, '8am-10am is 2 hours')
  t.equals(e.duration.minute, 0, '8am-10am has 0 minutes')

  t.end()
})

test('duration set for 8am-1:30pm', t => {
  const e = new Entry('8am-1:30pm worked on some things')
  
  t.equals(e.duration.hour, 5, '8am-1:30pm is 5 hours')
  t.equals(e.duration.minute, 30, '8am-1:30pm trails 30 min')

  t.end()
})

test('duration set for 11pm-2am', t => {
  const e = new Entry('11pm-2am worked on some things')
  
  t.equals(e.duration.hour, 3, '11pm-2am is 3 hours')

  t.end()
})

test('constructor assigns _id', t => {
  const e = new Entry('8am-10am worked on some things')

  t.ok(e._id, '_id is ok')
  t.end()
})

test('parse #tags', t => {
  const e = new Entry('8-10am worked on things #tag1 #tag2')

  t.deepEqual(e.tags, ['#tag1', '#tag2'], 'tags are parsed out to an array')
  t.end()
})

test('parse unique #tags', t => {
  const e = new Entry('8-10am worked on things #tag1 #tag1')

  t.deepEqual(e.tags, ['#tag1'], 'tags only appear once')
  t.end()
})

test('toJSON() returns a json obj', t => {
  const e = new Entry('8am-10am worked on some things')

  const json = e.toJSON()
  t.equals(json.message, '8am-10am worked on some things', 'message')
  t.ok(json.hasDates, 'hasDates')
  t.equals(e.from, json.from, 'from')
  t.equals(e.to, json.to, 'to')
  t.equals(json.duration.seconds, 2*60*60, 'duration seconds')
  t.equals(json.duration.from, e.from, 'duration from')
  t.equals(json.duration.to, e.to, 'duration to')
  t.equals(json._id, e._id, '_id')
  t.ok(moment(json.toArr).isSame(json.to), 'to and toArr are same date')
  t.ok(moment(json.fromArr).isSame(json.from), 'from and fromArr are same date')
  t.ok(json.toArr instanceof Array, 'toArr is an array')
  t.ok(json.fromArr instanceof Array, 'fromArr is an array')

  t.end()
})

test('fromJSON() will create an Entry from existing document', t => {
  const date = new Date('Jan 25, 2015 0:00:00')
  const existing = new Entry('8am-10am worked on things', {date})
  const json = existing.toJSON()
  const e = Entry.fromJSON(json)

  t.equals(existing._id, e._id, '_id matches')
  t.equals(existing.message, e.message, 'message matches')
  t.equals(moment(existing.to).toString(), moment(e.to).toString(), 'to matches')
  t.equals(moment(existing.from).toString(), moment(e.from).toString(), 'from matches')

  t.end()

})


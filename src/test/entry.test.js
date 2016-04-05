import test from 'tape'
import Entry, { version } from '../entry'
import moment from 'moment'

test('Entry class has a version number', t => {
  const e = new Entry('8am-10am worked on things')
  t.ok(version >= 1, 'current version is 1')
  t.equals(e.version, version, 'new entries get version')

  t.end()
})

test('simple entry construction 8am-10pm', t => {
  const e = new Entry('8am-10am worked on things')
  const { start, end } = e.getDates()
  t.ok(e.hasDates, 'entry has dates')
  t.equals(e.message, '8am-10am worked on things')
  t.equals(start.getHours(), 8, 'start is 8am')
  t.equals(end.getHours(), 10, 'start is 10am')

  t.end()
})

test('simple entry construction 8am-5pm', t => {
  const e = new Entry('8am-5pm worked on things')
  const { start, end } = e.getDates()
  t.ok(e.hasDates, 'entry has dates')
  t.equals(e.message, '8am-5pm worked on things')
  t.equals(start.getHours(), 8, 'start is 8am')
  t.equals(end.getHours(), 17, 'end is 5pm')

  t.end()
})

test('no times specified does not generate dates', t => {
  const e = new Entry('worked on some things')
  const { start, end } = e.getDates()
  t.notOk(e.hasDates, 'flag indicates that no dates are present')
  t.notOk(start, 'no start date provided')
  t.notOk(end, 'no end date provided')

  t.end()
})

test('passing date influences the dates', t => {
  const date = new Date('Jan 25, 2015 0:00:00')
  const msg = '8am-5pm worked on some things'
  const e = new Entry(msg, {date})
  const { start, end } = e.getDates()

  t.ok(moment(start).isSame(date, 'day'), 'start has the same day')
  t.ok(moment(end).isSame(date, 'day'), 'end has the same day')

  t.end()
})

test('no date defaults to today', t => {
  const date = new Date()
  const msg = '8am-5pm worked on some things'
  const e = new Entry(msg)
  const { start, end } = e.getDates()

  t.ok(moment(start).isSame(date, 'day'), 'start date is today')
  t.ok(moment(end).isSame(date, 'day'), 'end date is today')

  t.end()
})

test('created date added to entry', t => {
  const today = new Date()  
  const e = new Entry('8am-5pm working on things')
  const json = e.toJSON()

  t.ok(e.ref, 'ref is set')
  t.ok(moment(today).isSame(e.ref, 'second'), 'ref date is today')
  t.ok(json.ref, 'ref is set on json')
  t.ok(moment(today).isSame(json.ref, 'second'), 'json.ref date is today')
  t.end()
})

test('passed reference date added to entry', t => {
  const date = new Date(2016, 0, 1, 12, 15, 30) // Jan 1, 2016 12:15:30
  const e = new Entry('8am-5pm working on things', {date})
  const json = e.toJSON()

  t.ok(e.ref, 'ref is set')
  t.ok(moment(date).isSame(e.ref, 'second'), 'ref date is Jan 1')
  t.ok(json.ref, 'ref is set on json')
  t.ok(moment(date).isSame(json.ref, 'second'), 'json.ref date is Jan 1')
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

test('includes yesterday in message', t => {
  const yesterday = moment().subtract(1, 'day')
  const e = new Entry('yesterday 4-5pm worked on some things #test')

  t.ok(yesterday.isSame(e.start, 'day'), 'sets start to yesterday')
  t.ok(yesterday.isSame(e.end, 'day'), 'sets end to yesterday')
  t.equals(e.time, 'yesterday 4-5pm', 'time component includes \'yesterday\'')

  t.end()
})

test('specific day of week in message', t => {
  const date = new Date(2016, 2, 24) // Thurs, March 24
  const monday = moment(new Date(2016, 2, 21)) // Mon, March 21
  const e = new Entry('monday 4-5pm worked on some things #test', {date})

  t.ok(monday.isSame(e.start, 'day'), 'start is monday')
  t.ok(monday.isSame(e.end, 'day'), 'end is monday')

  t.end()
})

test('specific date in message', t => {
  const date = new Date(2016, 2, 24) // Thurs, March 24
  const mar15 = moment(new Date(2016, 2, 15)) // Mon, March 21
  const e = new Entry('Mar 15 4-5pm worked on some things #test', {date})

  t.ok(mar15.isSame(e.start, 'day'), 'start is mar 15')
  t.ok(mar15.isSame(e.end, 'day'), 'end is mar 15')

  t.end()
})

test('constructor assigns _id', t => {
  const e = new Entry('8am-10am worked on some things')

  t.ok(e._id, '_id is ok')
  t.end()
})

test('parse #tags', t => {
  const e = new Entry('8-10am worked on things #tag1 #tag2')

  t.ok(e.tags.has('#tag1'), 'tags are parsed into a Set')
  t.ok(e.tags.has('#tag2'), 'tags are parsed into a Set')
  t.end()
})

test('parse unique #tags', t => {
  const e = new Entry('8-10am worked on things #tag1 #tag1')

  t.equals(e.tags.size, 1, 'tags only appear once')
  t.ok(e.tags.has('#tag1'), 'tags are parsed')
  t.end()
})

test('parse #hyphened-tags and #underscored_tags', t => {
  const e = new Entry('8-10am worked on things #hyphened-tag #underscored_tag')

  t.ok(e.tags.has('#hyphened-tag'), 'hyphened tag is parsed into a Set')
  t.ok(e.tags.has('#underscored_tag'), 'underscore tag is parsed into a Set')
  t.end()
})

test('parsed time string is present', t => {
  const e = new Entry('8-10am worked on things')

  t.equals(e.time, '8-10am', 'entry.time contains matched string')
  t.end()
})

test('toJSON() returns a json obj', t => {
  const e = new Entry('8am-10am worked on some things #tag1 #tag2')

  const json = e.toJSON()
  t.equals(json.message, '8am-10am worked on some things #tag1 #tag2', 'message')
  t.ok(json.hasDates, 'hasDates')
  t.equals(e.start, json.start, 'start')
  t.equals(e.end, json.end, 'end')
  t.equals(json.duration.seconds, 2*60*60, 'duration seconds')
  t.equals(json.time, e.time, 'time')
  t.equals(json._id, e._id, '_id')
  t.equals(json.version, version, 'version')
  t.deepEquals(json.tags, [...e.tags], 'tags array')
  t.ok(moment(json.startArr).isSame(json.start), 'start and startArr are same date')
  t.ok(moment(json.endArr).isSame(json.end), 'end and endArr are same date')
  t.ok(json.startArr instanceof Array, 'startArr is an array')
  t.ok(json.endArr instanceof Array, 'endArr is an array')

  t.end()
})

test('fromJSON() will create an Entry from existing document', t => {
  const date = new Date('Jan 25, 2015 0:00:00')
  const existing = new Entry('8am-10am worked on things #tag1 #tag2', {date})
  const json = existing.toJSON()
  const e = Entry.fromJSON(json)

  t.equals(existing._id, e._id, '_id matches')
  t.equals(existing.version, e.version, 'version matches')
  t.equals(existing.message, e.message, 'message matches')
  t.equals(e.tags.size, 2, '2 tags')
  t.equals(moment(existing.start).toString(), moment(e.start).toString(), 'start matches')
  t.equals(moment(existing.end).toString(), moment(e.end).toString(), 'end matches')
  t.equals(e.time, '8am-10am', 'time is preserved')

  t.end()

})

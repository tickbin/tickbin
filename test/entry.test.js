'use strict'

let test = require('tape')
let Entry = require('../entry')

test('simple entry construction 8am-10pm', t => {
  const e = new Entry('8am-10am worked on things')
  const {start, end} = e.getDates()
  t.ok(e.hasDates, 'entry has dates')
  t.equals(e.message, '8am-10am worked on things')
  t.equals(start.getHours(), 8, 'start is 8am')
  t.equals(end.getHours(), 10, 'start is 10am')

  t.end()
})

test('simple entry construction 8am-5pm', t => {
  const e = new Entry('8am-5pm worked on things')
  const {start, end} = e.getDates()
  t.ok(e.hasDates, 'entry has dates')
  t.equals(e.message, '8am-5pm worked on things')
  t.equals(start.getHours(), 8, 'start is 8am')
  t.equals(end.getHours(), 17, 'end is 5pm')

  t.end()
})

test('no times specified does not generate dates', t => {
  const e = new Entry('worked on some things')
  const {start, end} = e.getDates()
  t.notOk(e.hasDates, 'flag indicates that no dates are present')
  t.notOk(start, 'no start date provided')
  t.notOk(end, 'no end date provided')

  t.end()
})

test('passing date influences the dates', t => {
  const date = new Date('Jan 25, 2015 0:00:00')
  const msg = '8am-5pm worked on some things'
  const e = new Entry(msg, {date})
  const {start, end} = e.getDates()
  t.equals(start.getFullYear(), 2015, 'start has the same year')
  t.equals(start.getMonth(), 0, 'start has same month')
  t.equals(start.getDate(), 25, 'start has same day')
  t.equals(end.getFullYear(), 2015, 'end has the same year')
  t.equals(end.getMonth(), 0, 'end has the same month')
  t.equals(end.getDate(), 25, 'end has the same day')

  t.end()
})

test('no date defaults to today', t => {
  const date = new Date()
  const msg = '8am-5pm worked on some things'
  const e = new Entry(msg)
  const {start,end} = e.getDates()

  t.equals(start.getFullYear(), anchor.getFullYear(), 'start year is today')
  t.equals(start.getMonth(), anchor.getMonth(), 'start month is today')
  t.equals(start.getDate(), anchor.getDate(), 'start date is today')
  t.equals(end.getFullYear(), anchor.getFullYear(), 'end year is today')
  t.equals(end.getMonth(), anchor.getMonth(), 'end month is today')
  t.equals(end.getDate(), anchor.getDate(), 'end date is today')

  t.end()
})

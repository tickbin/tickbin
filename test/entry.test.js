'use strict'

let test = require('tape')
let Entry = require('../entry')

test('simple entry construction 8am-10pm', t => {
  let e = new Entry('8am-10am worked on things')
  let {start, end} = e.getDates()
  t.ok(e.hasDates, 'entry has dates')
  t.equals(start.getHours(), 8, 'start is 8am')
  t.equals(end.getHours(), 10, 'start is 10am')

  t.end()
})

test('simple entry construction 8am-5pm', t => {
  let e = new Entry('8am-5pm worked on things')
  let {start, end} = e.getDates()
  t.ok(e.hasDates, 'entry has dates')
  t.equals(start.getHours(), 8, 'start is 8am')
  t.equals(end.getHours(), 17, 'end is 5pm')

  t.end()
})

test('no times specified does not generate dates', t => {
  let e = new Entry('worked on some things')
  let {start, end} = e.getDates()
  t.notOk(e.hasDates, 'flag indicates that no dates are present')
  t.notOk(start, 'no start date provided')
  t.notOk(end, 'no end date provided')

  t.end()
})

test('anchoring influences the dates', t => {
  const anchor = new Date('Jan 25, 2015 0:00:00')
  const msg = '8am-5pm worked on some things'
  let e = new Entry(msg, {anchor})
  let {start, end} = e.getDates()
  t.equals(start.getFullYear(), 2015, 'start has the same year')
  t.equals(start.getMonth(), 0, 'start has same month')
  t.equals(start.getDate(), 25, 'start has same day')
  t.equals(end.getFullYear(), 2015, 'end has the same year')
  t.equals(end.getMonth(), 0, 'end has the same month')
  t.equals(end.getDate(), 25, 'end has the same day')

  t.end()
})

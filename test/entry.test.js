'use strict'

let test = require('tape')
let Entry = require('../entry')

test('simple entry construction 8am-10pm', t => {
  let e = new Entry('8am-10am worked on things')
  let {start, end} = e.getDates()
  t.equals(start.getHours(), 8, 'start is 8am')
  t.equals(end.getHours(), 10, 'start is 10am')

  t.end()
})

test('simple entry construction 8am-5pm', t => {
  let e = new Entry('8am-5pm worked on things')
  let {start, end} = e.getDates()
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

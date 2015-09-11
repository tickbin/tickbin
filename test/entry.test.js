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

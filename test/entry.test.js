'use strict'

let test = require('tape')
let Entry = require('../entry')

test('simple entry construction', t => {
  let e = new Entry('8am-5pm worked on things')
  t.equals(e.original, '8am-5pm worked on things')

  let {start, end} = e.getDates()
  t.equals(start.getHours(), 8, 'start is 8am')
  t.equals(end.getHours(), 17, 'start is 5pm')

  t.end()
})

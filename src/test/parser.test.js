
import test from 'tape'
import parser from '../parser'

test('simple am times: 8am-10am', t => {
  let {start, end} = parser('8am-10am')
  t.equals(start.getHours(), 8, 'start is 8am')
  t.equals(end.getHours(), 10, 'end is 10am')

  t.end()
})

test('simple am to pm times: 9am-2pm', t => {
  let {start, end} = parser('9am-2pm')
  t.equals(start.getHours(), 9, 'start is 9am')
  t.equals(end.getHours(), 14, 'end is 2pm (14)')

  t.end()
})

test('simple pm times: 1pm-4pm', t => {
  let {start, end} = parser('1pm-4pm')
  t.equals(start.getHours(), 13, 'start is 1pm (13)')
  t.equals(end.getHours(), 16, 'end is 4pm (16)')

  t.end()
})

test('infer meridiem: 1-3pm', t => {
  let {start, end} = parser('1-3pm')
  t.equals(start.getHours(), 13, 'infer start is 1pm (13)')
  t.equals(end.getHours(), 15, 'end is 3pm (15)')

  t.end()
})

// Test is skipped because it currently doesn't pass
// Please see this issue: https://github.com/wanasit/chrono/issues/76 
test.skip('infer meridiem: 1pm-3', t => {
  let {start, end} = parser('1pm-3')
  t.equals(start.getHours(), 13, 'start is 1pm (13)')
  t.equals(end.getHours(), 15, 'infer end is 3pm (15)')

  t.end()
})

test('minutes: 9:15am-2:30pm', t => {
  let {start, end} = parser('9:15am-2:30pm')
  t.equals(start.getHours(), 9, 'start is 9am')
  t.equals(start.getMinutes(), 15, 'start is 9:15am')
  t.equals(end.getHours(), 14, 'end is 2pm (14)')
  t.equals(end.getMinutes(), 30, 'end is 2:30pm')

  t.end()
})

test('colon segmented 24 times: 08:000-13:00', t => {
  let {start, end} = parser('0800-1330')
  t.equals(start.getHours(), 8, 'start is 8am')
  t.equals(end.getHours(), 13, 'end is 1pm (13)')
  t.equals(end.getMinutes(), 30, 'end is 1:30pm')

  t.end()
})

test('proper 24h times: 0800-1330', t => {
  let {start, end} = parser('0800-1330')
  t.equals(start.getHours(), 8, 'start is 8am')
  t.equals(end.getHours(), 13, 'end is 1pm (13)')
  t.equals(end.getMinutes(), 30, 'end is 1:30pm')

  t.end()
})

test('no leading zero 24h times: 800-1300', t => {
  let {start, end} = parser('800-1300')
  t.equals(start.getHours(), 8, 'start is 8am')
  t.equals(end.getHours(), 13, 'end is 1pm (13)')

  t.end()
})

const anchor  = new Date('Jan 25, 2015 0:00:00')
const anchor2 = new Date('April 2, 2015 0:00:00')

test('anchored: dates relative to anchor', t => {
  let {start, end} = parser('8am-1pm', anchor)
  t.equals(start.getFullYear(), 2015, 'start is same year')
  t.equals(start.getMonth(), 0, 'start is same month as anchor')
  t.equals(start.getDate(), 25, 'start is same day as anchor')
  t.equals(end.getFullYear(), 2015, 'start is same year')
  t.equals(end.getMonth(), 0, 'start is same month as anchor')
  t.equals(end.getDate(), 25, 'start is same day as anchor')

  t.end()
})

test('anchored: dates relative to anchor2', t => {
  let {start, end} = parser('8am-1pm', anchor2)
  t.equals(start.getFullYear(), 2015, 'start is same year')
  t.equals(start.getMonth(), 3, 'start is same month as anchor')
  t.equals(start.getDate(), 2, 'start is same day as anchor')
  t.equals(end.getFullYear(), 2015, 'start is same year')
  t.equals(end.getMonth(), 3, 'start is same month as anchor')
  t.equals(end.getDate(), 2, 'start is same day as anchor')

  t.end()
})

test('overlapping times: 11pm-2am', t => {
  let {start, end} = parser('11pm-2am', anchor)
  t.equals(start.getDate(), 25, 'start is anchor day')
  t.equals(end.getDate(), 26, 'end is day after anchor')

  t.end()
})

// Test is skipped because it currently doesn't pass
// Please see this issue: https://github.com/MemoryLeaf/tickbin/issues/26
test.skip('overlapping times for current day: 11pm-2am', t => {
  let {start, end} = parser('11pm-2am')
  t.equals(start.getDate(), 24, 'start is day before anchor')
  t.equals(end.getDate(), 25, 'end is anchor day')

  t.end()
})

test('matching text is returned', t => {
  const {text} = parser('1-3pm')
  const {text2} = parser('1-3pm did some things')
  t.equals(text, '1-3pm', 'parser returns matching text')
  t.equals(text2, '1-3pm', 'parser returns only matching text')

  t.end()
})

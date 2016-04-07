import test from 'tape'
import chrono from 'chrono-node'
import militaryParser from '../parsers/militaryParser'

const parser = new chrono.Chrono
parser.parsers.push(militaryParser)

test('matches leading zeros 0800-0930', t => {
  const results = parser.parse('0800-0930 worked on things')

  t.equals(results[0].start.get('hour'), 8, 'start is 8 am')
  t.equals(results[0].start.get('minute'), 0, 'start is 8:00 am')
  t.equals(results[0].end.get('hour'), 9, 'start is 9:30 am')
  t.equals(results[0].end.get('minute'), 30, 'start is 9:30 am')
  t.end()
})

test('matches non-leading zeros 1100-1300', t => {
  const results = parser.parse('1100-1300 worked on things')

  t.equals(results[0].start.get('hour'), 11, 'start is 11 am')
  t.equals(results[0].start.get('minute'), 0, 'start is 11:00 am')
  t.equals(results[0].end.get('hour'), 13, 'start is 1:00 pm')
  t.equals(results[0].end.get('minute'), 0, 'start is 1:00 pm')
  t.end()
})

test('adds militaryParser to tags', t => {
  const results = parser.parse('1100-1300 worked on things')

  t.ok(results[0].tags['militaryParser'], 'tagged with militaryParser')
  t.end()
})

test('military time has certain meridiem', t => {
  const results = parser.parse('0800-1300 worked on things')

  t.ok(results[0].start.isCertain('meridiem'))
  t.ok(results[0].end.isCertain('meridiem'))
  t.end()
})

test('set matching text', t => {
  const results = parser.parse('spent 0800-1300 working on things')

  t.equals(results[0].text, '0800-1300', 'sets matching text')
  t.equals(results[0].index, 6, 'sets index')
  t.end()
})

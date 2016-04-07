import test from 'tape'
import parser from '../parser'
import NoMeridiemError from '../errors/NoMeridiemError'

test('4-5 throws error', t => {
  t.throws(() => parser('4-5 working on things'), NoMeridiemError, '4-5 throws')
  t.end()
})

test('specifying meridiem does not throw', t => {
  t.doesNotThrow(() => parser('4pm-5 stuff'), 'start has a meridiem')
  t.doesNotThrow(() => parser('4-5pm stuff'), 'end has a meridiem')
  t.doesNotThrow(() => parser('4pm-5pm stuff'), 'both has a meridiem')
  t.end()
})

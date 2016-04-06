import test from 'tape'
import parser from '../parser'
import NoMeridiemError from '../errors/NoMeridiemError'

test('4-5 throws error', t => {
  t.throws(() => parser('4-5 working on things'), NoMeridiemError, '4-5 throws')
  t.end()
})


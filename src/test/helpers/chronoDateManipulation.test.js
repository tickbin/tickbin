
import test from 'tape'
import chrono from 'chrono-node'
import * as chronoDateManipulation from '../../helpers/chronoDateManipulation'

test('add increment to each unit of time', t => {
  //  Test will compare difference against initial start date of
  //  Feb 15, 2016 12:30:30
  const result = chrono.parse('12:30:30pm-2pm', new Date('Feb 15, 2016 00:00:00'))
  const firstStart = result[0].start

  chronoDateManipulation.add(1, 'year', firstStart)
  chronoDateManipulation.add(1, 'month', firstStart)
  chronoDateManipulation.add(1, 'day', firstStart)
  chronoDateManipulation.add(1, 'hour', firstStart)
  chronoDateManipulation.add(15, 'minute', firstStart)
  chronoDateManipulation.add(15, 'second', firstStart)
  chronoDateManipulation.add(500, 'millisecond', firstStart)

  t.equals(firstStart.get('year'), 2017, 'Year incremented properly')
  t.equals(firstStart.get('month'), 3, 'Month incremented properly')
  t.equals(firstStart.get('day'), 16, 'Day incremented properly')
  t.equals(firstStart.get('hour'), 13, 'Hour incremented properly')
  t.equals(firstStart.get('minute'), 45, 'Minute incremented properly')
  t.equals(firstStart.get('second'), 45, 'Second incremented properly')
  t.equals(firstStart.get('millisecond'), 500, 'Millisecond incremented properly')

  t.end()
})

test('subtract amount to each unit of time', t => {
  //  Test will compare difference against initial start date of
  //  Feb 15, 2016 12:30:30
  const result = chrono.parse('12:30:30pm-2pm', new Date('Feb 15, 2016 00:00:00'))
  const firstStart = result[0].start

  chronoDateManipulation.subtract(1, 'year', firstStart)
  chronoDateManipulation.subtract(1, 'month', firstStart)
  chronoDateManipulation.subtract(1, 'day', firstStart)
  chronoDateManipulation.subtract(1, 'hour', firstStart)
  chronoDateManipulation.subtract(15, 'minute', firstStart)
  chronoDateManipulation.subtract(15, 'second', firstStart)
  chronoDateManipulation.subtract(500, 'millisecond', firstStart)

  t.equals(firstStart.get('year'), 2015, 'Year decremented properly')
  t.equals(firstStart.get('month'), 1, 'Month decremented properly')
  t.equals(firstStart.get('day'), 14, 'Day decremented properly')
  t.equals(firstStart.get('hour'), 11, 'Hour decremented properly')
  t.equals(firstStart.get('minute'), 15, 'Minute decremented properly')
  //  Note: Since we are also subtracting 500 milliseconds, second will be 14
  //  instead of 15.
  t.equals(firstStart.get('second'), 14, 'Second decremented properly')
  t.equals(firstStart.get('millisecond'), 500, 'Millisecond decremented properly')

  t.end()
})

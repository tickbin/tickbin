import test from 'tape'
import sinon from 'sinon'
import moment from 'moment'
import promised from 'sinon-as-promised'
import {
  saveTimer,
  commitTimer,
  removeTimer,
  getTimer
} from '../timers'

let fakeDb = {
  put: function () {}
}

const fakeTimer = {
  start: new Date(),
  end: new Date(),
  message: 'test message'
}

const startMessage = '8am fix bugs'
const stopMessage  = '10am fix bugs and create more'

test('Test saveTimer', t => {
  t.test('require a db', t => {
    function saveTimerWithoutDb() {
      return saveTimer(null, { timers: [] }, startMessage)
    }

    t.plan(1)
    t.throws(saveTimerWithoutDb, /provide a couchdb/, 'saveTimer requires a db')
  })

  t.test('require a timersDoc', t => {
    function saveTimerWithoutTimersDoc() {
      return saveTimer(fakeDb, null, startMessage)
    }

    t.plan(1)
    t.throws(
      saveTimerWithoutTimersDoc,
      /provide a document of timers/,
      'saveTimer requires a document of timers'
    )
  })

  t.test('only allow one timer', t => {
    function saveTimerMultipleTimers() {
      return saveTimer(fakeDb, { timers: [{}] }, startMessage)
    }

    t.plan(1)
    t.throws(
      saveTimerMultipleTimers,
      /already have a timer/,
      'saveTimer only allows one timer'
    )
  })

  t.test('saveTimer should return a promise', t => {
    const sandbox = sinon.sandbox.create()

    const stubPut = sandbox.stub(fakeDb, 'put').resolves()

    let res = saveTimer(fakeDb, { timers: [] })

    t.plan(1)
    t.ok(typeof res.then === 'function', 'saveTimer returned a promise')

    res.then(() => sandbox.restore())
  })

  t.test('creates timer with current time', t => {
    const sandbox = sinon.sandbox.create()

    const stubPut = sandbox.stub(fakeDb, 'put').resolves()

    let res = saveTimer(fakeDb, { timers: [] })

    t.plan(1)
    res.then(timer => {
      t.ok(timer.start, 'created a timer with a start time')
      sandbox.restore()
    })
  })

  t.test('creates timer with supplied time', t => {
    const sandbox = sinon.sandbox.create()

    const stubPut = sandbox.stub(fakeDb, 'put').resolves()

    let res = saveTimer(fakeDb, { timers: [] }, '8am')

    const today8AM = moment('8am', 'ha').toDate().toString()

    t.plan(1)
    res.then(timer => {
      t.equal(timer.start.toString(), today8AM, 'created a timer with a start time')
      sandbox.restore()
    })
  })

  t.test('creates timer with current time and supplied message', t => {
    const sandbox = sinon.sandbox.create()

    const stubPut = sandbox.stub(fakeDb, 'put').resolves()

    let res = saveTimer(fakeDb, { timers: [] }, 'test message')

    t.plan(1)
    res.then(timer => {
      t.equal(timer.message, 'test message', 'created a timer with a message')
      sandbox.restore()
    })
  })

  t.test('creates timer with supplied time and message', t => {
    const sandbox = sinon.sandbox.create()

    const stubPut = sandbox.stub(fakeDb, 'put').resolves()

    let res = saveTimer(fakeDb, { timers: [] }, '8am test message')

    const today8AM = moment('8am', 'ha').toDate().toString()

    t.plan(2)
    res.then(timer => {
      t.equal(timer.start.toString(), today8AM, 'created a timer with a start time')
      t.equal(timer.message, 'test message', 'created a timer with a message')
      sandbox.restore()
    })
  })
})

test('Test commitTimer', t => {
  t.test('require a db', t => {
    function commitTimerWithoutDb() {
      return commitTimer(null)
    }

    t.plan(1)
    t.throws(
      commitTimerWithoutDb,
      /provide a couchdb/,
      'commitTimer requires a db'
    )
  })

  t.test('require a timer', t => {
    function commitTimerWithoutTimer() {
      return commitTimer(fakeDb)
    }

    t.plan(1)
    t.throws(
      commitTimerWithoutTimer,
      /provide a timer/,
      'commitTimer requires a db'
    )
  })

  t.test('commitTimer should return a promise', t => {
    const sandbox = sinon.sandbox.create()

    const stubPut = sandbox.stub(fakeDb, 'put').resolves()

    let res = commitTimer(fakeDb, fakeTimer)

    t.plan(1)
    t.ok(typeof res.then === 'function', 'commitTimer returned a promise')

    res.then(() => sandbox.restore())
  })

  t.test('commitTimer should create entry', t => {
    const sandbox = sinon.sandbox.create()

    const stubPut = sandbox.stub(fakeDb, 'put').resolves()

    let res = commitTimer(fakeDb, fakeTimer)

    t.plan(1)
    res.then(entry => {
      t.equal(entry.message, fakeTimer.message, 'created entry from timer')
      sandbox.restore()
    })
  })
})

test('Test removeTimer', t => {
  t.test('require a db', t => {
    function removeTimerWithoutDb() {
      return removeTimer(null)
    }

    t.plan(1)
    t.throws(
      removeTimerWithoutDb,
      /provide a couchdb/,
      'removeTimer requires a db'
    )
  })

  t.test('require a timersDoc', t => {
    function removeTimerWithoutTimersDoc() {
      return removeTimer(fakeDb, null)
    }

    t.plan(1)
    t.throws(
      removeTimerWithoutTimersDoc,
      /provide a document of timers/,
      'removeTimer requires a document of timers'
    )
  })

  t.test('ensure a timer exists', t => {
    function removeTimerZeroTimers() {
      return removeTimer(fakeDb, { timers: [] })
    }

    t.plan(1)
    t.throws(
      removeTimerZeroTimers,
      /do not have a timer/,
      'removeTimer requires a timer exists'
    )
  })

  t.test('removeTimer should return a promise', t => {
    const sandbox = sinon.sandbox.create()

    const stubPut = sandbox.stub(fakeDb, 'put').resolves()

    let res = removeTimer(fakeDb, { timers: [{}] })

    t.plan(1)
    t.ok(typeof res.then === 'function', 'removeTimer returned a promise')

    res.then(() => sandbox.restore())
  })

  t.test('removeTimer should resolve to the removed timer', t => {
    const sandbox = sinon.sandbox.create()

    const stubPut = sandbox.stub(fakeDb, 'put').resolves()

    let res = removeTimer(fakeDb, { timers: [fakeTimer] })

    t.plan(1)
    res.then(timer => {
      t.equal(timer.message, fakeTimer.message, 'resolved to timer')
      sandbox.restore()
    })
  })
})

test('Test getTimer', t => {
  t.test('require a timersDoc', t => {
    function getTimerWithoutTimersDoc() {
      return getTimer(null)
    }

    t.plan(1)
    t.throws(
      getTimerWithoutTimersDoc,
      /provide a document of timers/,
      'getTimer requires a document of timers'
    )
  })

  t.test('ensure a timer exists', t => {
    function getTimerZeroTimers() {
      return getTimer({ timers: [] })
    }

    t.plan(1)
    t.throws(
      getTimerZeroTimers,
      /do not have a timer/,
      'getTimer requires a timer exists'
    )
  })

  t.test('returns a timer', t => {
    const timer = getTimer({ timers: [fakeTimer] })

    t.plan(1)
    t.equal(timer.message, fakeTimer.message, 'returned a timer')
  })
})

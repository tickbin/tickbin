import test from 'tape'
import sinon from 'sinon'
import promised from 'sinon-as-promised'
import createEntry from '../create'

let fakeDb = {
  put: function () {}
}

const message = '8am-11am fixed bugs #tickbin'

test('createEntry requires a db', t => {
  function createWithoutDb () {
    return createEntry(null, message)
  }

  t.plan(1)
  t.throws(createWithoutDb, /provide a couchdb/, 'createEntry requires a db')
})

test('createEntry requires a message', t => {
  function createWithoutMessage () {
    return createEntry(fakeDb, null)
  }

  t.plan(1)
  t.throws(
    createWithoutMessage,
    /provide a message/,
    'createEntry requires a message'
  )
})

test('createEntry should return a promise', t => {
  const sandbox = sinon.sandbox.create()

  const stubPut = sandbox.stub(fakeDb, 'put').resolves()

  let res = createEntry(fakeDb, message)

  t.plan(1)
  t.ok(typeof res.then === 'function', 'createEntry return a promise')

  res.then(() => sandbox.restore())
})

test('createEntry calls db.put', t => {
  const sandbox = sinon.sandbox.create()

  const stubPut = sandbox.stub(fakeDb, 'put').resolves()

  createEntry(fakeDb, message).then(() => {
    t.plan(1)
    t.ok(stubPut.calledOnce, 'called db.put once')
  })
  .then(() => sandbox.restore())
})

test('createEntry resolves to created doc', t => {
  const sandbox = sinon.sandbox.create()

  const stubPut = sandbox.stub(fakeDb, 'put').resolves()

  createEntry(fakeDb, message).then(doc => {
    t.plan(1)
    t.equal(doc.message, message, 'createEntry resolved to created doc')
  })
  .then(() => sandbox.restore())
})

test('message should have a duration', t => {
  createEntry(fakeDb, 'fixed bugs #tickbin')
  .then(() => t.fail('createEntry promise should reject'))
  .catch(() => {
    t.pass('createEntry promise was rejected')
    t.end()
  })
})

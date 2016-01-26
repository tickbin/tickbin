import test from 'tape'
import sinon from 'sinon'
import EventEmitter from 'events'

import sync from '../sync'

function getFakeDb() {
  return { 
    sync: function() {}
  }
}

test('sync() requires a db, dst', t => {
  const fakeDb = getFakeDb()
  sinon.stub(fakeDb, 'sync').returns(new EventEmitter())

  function syncWithoutDb() {
    sync()
  }

  function syncWithoutDst() {
    sync(getFakeDb())
  }

  t.plan(2)
  t.throws(syncWithoutDb, /provide a couchdb/, 'sync requires a db')
  t.throws(syncWithoutDst, /provide a destination/, 'sync requires a dst')
})



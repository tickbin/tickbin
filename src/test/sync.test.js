import test from 'tape'
import sinon from 'sinon'
import EventEmitter from 'events'

import sync from '../sync'
import { _getLastSync } from '../sync'

function getFakeDb() {
  return { 
    sync: function() {},
    get: function() {},
    put: function() {}
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

test('_getLastSync() gets the last_sync doc', t => {
  const fakeDb = getFakeDb()
  const stubGet = sinon.stub(fakeDb, 'get').resolves()

  t.plan(2)
  _getLastSync(fakeDb).then(() => {
    t.ok(stubGet.calledOnce, 'get called once')
    t.ok(stubGet.calledWith('_local/last_sync'), 'gets last_sync') 
  })
})

test('_getLastSync() failing to get last_sync, puts last sync', t => {
  const fakeDb = getFakeDb()
  const stubGet = sinon.stub(fakeDb, 'get')
  stubGet.onCall(0).rejects() // simulate last_sync doc not existing
  stubGet.onCall(1).resolves()
  const stubPut = sinon.stub(fakeDb, 'put').resolves()

  t.plan(3)
  _getLastSync(fakeDb).then(() => {
    const putArg = stubPut.getCall(0).args[0] // the last_sync doc put
    t.equals(putArg._id, '_local/last_sync', 'puts a new last_sync')
    t.equals(putArg.push.last_seq, null, 'sets push last_seq null')
    t.equals(putArg.pull.last_seq, null, 'sets pull last_seq null')
  })
})



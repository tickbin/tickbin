import test from 'tape'
import sinon from 'sinon'
import EventEmitter from 'events'

import TickSyncer from '../sync'
import { _getLastSync } from '../sync'
import { _updateLastSync } from '../sync'

function getFakeDb() {
  return { 
    sync: function() {},
    get: function() {},
    put: function() {}
  }
}

test('new Sync requires a db, dst', t => {
  const fakeDb = getFakeDb()
  sinon.stub(fakeDb, 'sync').returns(new EventEmitter())

  function syncWithoutDb() {
    return new TickSyncer()
  }

  function syncWithoutRemote() {
    return new TickSyncer(getFakeDb())
  }

  t.plan(2)
  t.throws(syncWithoutDb, /provide a couchdb/, 'sync requires a db')
  t.throws(syncWithoutRemote, /provide a remote/, 'sync requires a remote')
})

test('new Sync sets db, remote', t => {
  const fakeDb = getFakeDb()
  const stubGet = sinon.stub(fakeDb, 'get').resolves()
  const tickSync = new TickSyncer(fakeDb, 'remote')

  t.plan(3)
  t.equals(tickSync.db, fakeDb, 'sets db')
  t.equals(tickSync.remote, 'remote', 'sets remote')
  t.ok(stubGet.calledOnce)
})

test('TickSyncer.getLastSync() gets the last_sync doc', t => {
  const fakeDb = getFakeDb()
  const stubGet = sinon.stub(fakeDb, 'get').resolves()
  const tickSync = new TickSyncer(fakeDb, 'remote')

  t.plan(1)
  tickSync.getLastSync().then(() => {
    t.ok(stubGet.calledWith('_local/last_sync'), 'gets last_sync') 
  })
})

test('TickSyncer.sync() calls db.sync', t => {
  const fakeDb = getFakeDb()
  const last_sync = { push: { last_seq: 10 }, pull: { last_seq: 20 }}
  const stubGet = sinon.stub(fakeDb, 'get').resolves(last_sync)
  const evt = new EventEmitter()
  const stubSync = sinon.stub(fakeDb, 'sync').returns(evt)

  const tickSync = new TickSyncer(fakeDb, 'remote')

  t.plan(4)
  tickSync.sync().then(() => {
    const syncCallArgs = stubSync.getCall(0).args
    t.ok(stubSync.calledOnce, 'db.sync is called')
    t.ok(syncCallArgs[0], 'remote', 'sync to remote')
    t.equals(syncCallArgs[1].push.since, 10, 'push since 10')
    t.equals(syncCallArgs[1].pull.since, 20, 'pull since 20')
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

test('_updateLastSync() updates the last_sync doc', t => {
  const fakeDb = getFakeDb()
  const stubPut = sinon.stub(fakeDb, 'put').resolves()
  const lastSync = { push: { last_seq: null }, pull: { last_seq: null }}
  const info = { push: { last_seq: 10 }, pull: { last_seq: 20 }}

  t.plan(3)
  _updateLastSync(fakeDb, lastSync, info)
  const putArgs = stubPut.getCall(0).args
  t.ok(stubPut.calledOnce, 'put was called once')
  t.equals(putArgs[0].push.last_seq, 10, 'puts push last_seq')
  t.equals(putArgs[0].pull.last_seq, 20, 'puts pull last_seq')
})



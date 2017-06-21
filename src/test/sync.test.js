import test from 'tape'
import sinon from 'sinon'
import _ from 'lodash'
import EventEmitter from 'events'

import sync from '../sync'

function getFakeDb() {
  return { 
    sync: function() {},
    get: function() {},
    put: function() {}
  }
}

const last_sync = { 
  _id: '_local/last_sync', 
  push: { last_seq: 10 }, 
  pull: { last_seq: 20 }
}

test('requires a db, dst', t => {
  function syncWithoutDb() {
    return sync()
  }

  function syncWithoutRemote() {
    return sync(getFakeDb())
  }

  t.plan(2)
  t.throws(syncWithoutDb, /provide a couchdb/, 'sync requires a db')
  t.throws(syncWithoutRemote, /provide a remote/, 'sync requires a remote')
})

// TODO: we likely don't need this test as we don't emit on the emitter
// anywhere in the code base
test.skip('return an event emitter', t => {
  const fakeDb = getFakeDb()
  sinon.stub(fakeDb, 'get').resolves()
  const evt = sync(fakeDb, 'remote')

  t.plan(1)
  t.ok(evt.emit, 'sync returns something with emit()')
})

// skipping last_sync related tests for now, we've removed this code
// from sync
test.skip('tries to get last_sync doc', t => {
  const fakeDb = getFakeDb()
  const stubGet = sinon.stub(fakeDb, 'get').resolves()

  sync(fakeDb, 'remote')

  const getCall = stubGet.getCall(0)
  t.plan(2)
  t.ok(stubGet.calledOnce, 'get only called once')
  t.ok(getCall.calledWith('_local/last_sync'), 'tries to get last_sync')
})

// skipping last_sync related tests for now, we've removed this code
// from sync
test.skip('if last_sync not found, put it', t => {
  const fakeDb = getFakeDb()
  const stubGet = sinon.stub(fakeDb, 'get')
  const stubPut = sinon.stub(fakeDb, 'put').resolves()
  stubGet.onCall(0).rejects() // last_sync doesn't exist
  stubGet.onCall(1).resolves()

  sync(fakeDb, 'remote')

  t.plan(3)
  _.defer(() => {
    t.ok(stubGet.calledTwice, 'calls get twice')
    t.equals(stubPut.getCall(0).args[0]._id, '_local/last_sync', 'puts last_sync')
    t.equals(stubGet.getCall(1).args[0], '_local/last_sync', 'gets again')
  })
})

// skipping last_sync related tests for now, we've removed this code
// from sync
test.skip('syncs with last_sync info', t => {
  const fakeDb = getFakeDb()
  const stubGet = sinon.stub(fakeDb, 'get').resolves(last_sync)
  const stubSync = sinon.stub(fakeDb, 'sync')

  sync(fakeDb, 'remote')

  t.plan(4)
  _.defer(() => {
    const syncArgs = stubSync.getCall(0).args
    t.ok(stubSync.calledOnce, 'db.sync called once') 
    t.equals(syncArgs[0], 'remote', 'syncs with remote')
    t.equals(syncArgs[1].push.since, 10, 'since last push')
    t.equals(syncArgs[1].pull.since, 20, 'since last pull')
  })
})

// skipping last_sync related tests for now, we've removed this code
// from sync
test.skip('updates last_sync doc when complete', t => {
  const fakeDb = getFakeDb()
  const stubGet = sinon.stub(fakeDb, 'get').resolves(last_sync)
  const stubPut = sinon.stub(fakeDb, 'put')
  const emitter = new EventEmitter()
  const stubSync = sinon.stub(fakeDb, 'sync').returns(emitter)

  sync(fakeDb, 'remote')
  t.plan(4)
  _.defer(() => {
    const complete = { push: { last_seq: 11 }, pull: { last_seq: 21 }}
    emitter.emit('complete', complete)
    const putArgs = stubPut.getCall(0).args
    t.ok(stubPut.calledOnce, 'put called once')
    t.equals(putArgs[0]._id, '_local/last_sync', 'updates last_sync')
    t.equals(putArgs[0].push.last_seq, 11, 'push last_seq from complete info')
    t.equals(putArgs[0].pull.last_seq, 21, 'pull last_seq from complete info')
  })
})

test('db.sync events emit on sync() returned emitter', t => {
  const fakeDb = getFakeDb()
  const stubGet = sinon.stub(fakeDb, 'get').resolves(last_sync)
  const stubPut = sinon.stub(fakeDb, 'put')
  const emitter = new EventEmitter()
  const stubSync = sinon.stub(fakeDb, 'sync').returns(emitter)

  const s = sync(fakeDb, 'remote')

  t.plan(1)
  _.defer(() => {
    const payload = { push: { last_seq: 11}, pull: { last_seq: 21 }}
    s.on('test', info => {
      t.equals(info, payload, 'complete events forward')
    }) 
    emitter.emit('test', payload)
  })
})


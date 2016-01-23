import test from 'tape'
import sinon from 'sinon'

import { map0to1 } from '../upgrade'
import { map1to2 } from '../upgrade'
import upgrade from '../upgrade'

const rows = [
  { doc: { from: new Date(), message: '1pm-2pm work'} },
  { doc: { from: new Date(), message: '1pm-2pm work'} }
]
var fakeDb = {
  query: function () {
    let p = new Promise((resolve, reject) => {
      resolve({ rows }) 
    })
    return p 
  }, 
  bulkDocs: function (docs) {
    let p = new Promise((resolve, reject) => {
      resolve()
    })
    return p
  }
}

test('upgrade requires a db', t => {

  function upgradeWithoutDb() {
    return upgrade()
  }
  function upgradeWithDb() {
    return upgrade(fakeDb) 
  }

  t.plan(2)
  t.throws(upgradeWithoutDb, /provide a couchdb/, 'upgrade requires a db')
  t.doesNotThrow(upgradeWithDb, 'upgrade requires a db')
})

test('upgrade calls query', t => {
  const spyQuery = sinon.spy(fakeDb, 'query')
  const spyBulkDocs = sinon.spy(fakeDb, 'bulkDocs')

  t.plan(2)
  upgrade(fakeDb).then( () => {
    t.ok(spyQuery.calledOnce, 'query called once')
    t.ok(spyBulkDocs.calledOnce, 'bulkDocs called once')
  })
})

test('map0to1', t => {
  const v0 = { 
    from: new Date(),
    message: '1pm-2pm some work'
  }
  const v1 = map0to1(v0)

  t.equals(v1.version, 1, 'sets version to 1')
  t.end()
})

test('map1to2', t => {
  const v1 = {
    from: new Date(),
    message: '1pm-2pm some work'
  }
  const v2 = map1to2(v1)

  t.equals(v2.version, 2, 'sets version to 2')
  t.equals(v2.time, '1pm-2pm', 'adds parsed time')
  t.end()
})

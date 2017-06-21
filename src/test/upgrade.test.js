import test from 'tape'
import sinon from 'sinon'

import { map0to1 } from '../upgrade'
import { map1to2 } from '../upgrade'
import { map2to3 } from '../upgrade'
import { map3to4 } from '../upgrade'
import { map4to5 } from '../upgrade'
import { map5to6 } from '../upgrade'
import { map6to7 } from '../upgrade'
import { map7to8 } from '../upgrade'
import upgrade from '../upgrade'

var docs = [
  { from: new Date(), message: '1pm-2pm work'},
  { from: new Date(), message: '1pm-2pm work'}
]
var fakeDb = {
  find: function() {},
  bulkDocs: function() {}
}

test('upgrade requires a db', t => {

  function upgradeWithoutDb() {
    return upgrade()
  }
  function upgradeWithDb() {
    return upgrade(fakeDb) 
  }

  t.plan(1)
  t.throws(upgradeWithoutDb, /provide a couchdb/, 'upgrade requires a db')
})

test('upgrade calls find', t => {
  const stubFind = sinon.stub(fakeDb, 'find').resolves(docs)
  const stubBulkDocs = sinon.stub(fakeDb, 'bulkDocs').resolves()

  t.plan(2)
  upgrade(fakeDb).then( () => {
    t.ok(stubFind.calledOnce, 'query called once')
    t.ok(stubBulkDocs.calledOnce, 'bulkDocs called once')
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

test('map2to3', t => {
  const v2 = {}
  v2.fromArr = [2016, 0, 20, 11, 30, 0, 0]
  v2.from    = new Date(...v2.fromArr)
  v2.toArr   = [2016, 0, 20, 12, 30, 0, 0]
  v2.to      = new Date(...v2.toArr)

  const v3 = map2to3(v2)

  t.equals(v3.version, 3, 'sets version to 3')

  t.notOk(v3.from, 'v3 does not have from')
  t.notOk(v3.fromArr, 'v3 does not have fromArr')
  t.notOk(v3.to, 'v3 does not have to')
  t.notOk(v3.toArr, 'v3 does not have toArr')

  t.equals(v3.start, v2.from, 'from was changed to start')
  t.equals(v3.startArr, v2.fromArr, 'fromArr was changed to startArr')
  t.equals(v3.end, v2.to, 'to was changed to end')
  t.equals(v3.endArr, v2.toArr, 'toArr was changed to endArr')

  t.end()
})

test('map3to4', t => {
  const v3 = {
    start: new Date(2016, 0, 1, 12, 0, 0, 0),
  }

  const v4 = map3to4(v3)

  t.equals(v4.version, 4, 'sets version to 4')
  t.equals(v4.ref.toString(), v3.start.toString(), 'ref is set to start')

  t.end()
})

test('map4to5', t => {
  const v4 = {
    "start": "2016-05-27T22:45:00.000Z",
    "startArr": [
      2016,
      4,
      27,
      15,
      45,
      0,
      0
    ],
    "end": "2016-05-28T00:00:00.000Z",
    "endArr": [
      2016,
      4,
      27,
      17,
      0,
      0,
      0
    ]
  }

  const v5 = map4to5(v4)

  t.equals(v5.version, 5, 'sets version to 5')
  t.equals(v5.startArr[3], 22, 'set startArr to UTC')
  t.equals(v5.endArr[3], 0, 'set endArr to UTC')

  t.end()
})

test('map5to6', t => {
  const messageWithoutTime = 'did some #stuff'

  const v5 = {
    message: `1-2pm ${messageWithoutTime}`,
    time: '1-2pm'
  }

  const v6 = map5to6(v5)

  t.equals(v6.version, 6, 'sets version to 6')
  t.equals(v6.original, v5.message, 'saves original message')
  t.equals(v6.message, messageWithoutTime, 'saves message without time')

  t.end()
})

test('map6to7', t => {
  t.test('no createdFrom', t => {
    const v6 = {}

    const v7 = map6to7(v6)

    t.equals(v7.version , 7, 'sets verstion to 7')
    t.equals(v7.createdFrom, 'calendar', 'sets createdFrom to calendar')

    t.end()
  })

  t.test('existing createdFrom', t => {
    const v6 = {
      createdFrom: 'duration'
    }

    const v7 = map6to7(v6)

    t.equals(v7.version , 7, 'sets version to 7')
    t.equals(v7.createdFrom, 'duration', 'does not change createdFrom')

    t.end()
  })

  t.end()
})

test('map7to8', t => {
  //  Malformed entry
  const v7 = {
    message: '',
    time: '0945-1200 connection api end point to consumer #streamline',
    original: '0945-1200 connection api end point to consumer #streamline'
  }

  const v8 = map7to8(v7)

  t.equals(v8.version, 8, 'sets version to 8')
  t.equals(v8.message, 'connection api end point to consumer #streamline', 'fixes message')
  t.equals(v8.time, '0945-1200', 'fixes time')
  t.equals(v8.original, v7.original, 'does not change original')

  t.end()
})

import test from 'tape'
import { map0to1 } from '../upgrade'
import { map1to2 } from '../upgrade'

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

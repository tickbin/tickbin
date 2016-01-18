import test from 'tape'

import { filterTags } from '../query'

test('filterTags() finds tags in source using OR', t => {
  const src = ['a', 'b', 'c', 'd']
  t.ok(filterTags(['a'], src), 'finds single tag')
  t.ok(filterTags(['a', 'b'], src), 'finds multiple tags')
  t.ok(filterTags(['a', 'x'], src), 'finds any matching tag')

  t.end()
})

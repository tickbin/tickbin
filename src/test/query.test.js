import test from 'tape'

import { filterTags, hashTags } from '../query'

test('filterTags() finds tags in source using AND', t => {
  const doc = { tags: ['a', 'b', 'c', 'd'] }
  t.ok(filterTags(['a'], doc), 'finds single tag')
  t.ok(filterTags(['a', 'b'], doc), 'finds multiple tags')
  t.notOk(filterTags(['x'], doc), 'does not find single tag')
  t.notOk(filterTags(['a', 'x'], doc), 'does not find multiple tags')

  t.end()
})

test('hashTags() prepends # to tags', t => {
  t.deepEquals(hashTags(['a']), ['#a'], 'prepends # to single tag')
  t.deepEquals(hashTags(['#a']), ['#a'], 'does not prepend if # already exists')
  t.deepEquals(hashTags(['#a', 'b']), ['#a', '#b'], 'prepends only tags without #')

  t.end()
})
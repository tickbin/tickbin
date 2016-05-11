#!/usr/bin/env node

/**
 * Simple command to delete all indexes in pouch
 */

import db from '../db'
import createEntryIndex from '../db/designEntryIndex'

db.on('indexed', () => {
  db.getIndexes()
  .then(res => {
    return res.indexes
    .filter(idx => idx.name !== '_all_docs')
    .map(idx => {
      console.log('removing index')
      console.log(idx)
      db.deleteIndex(idx)
    })
  })
  .then(() => {
    return createEntryIndex(db)
  })
  .then(indexes => {
    console.log('re-indexed');
    return db.getIndexes()
  })
  .then(indexes => {
    console.log('indexes present', indexes)
  })
  .catch(err => console.log(err))
})

#!/usr/bin/env node

/**
 * Simple command to delete all indexes in pouch
 *
 * This is intended as a developer utility helpful when developing new indexes.
 * It will find all the indexes, delete them, and then rerun the
 * createEntryIndex function that installs indexes
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
    console.log('re-indexed')
    return db.getIndexes()
  })
  .then(indexes => {
    console.log('indexes present', indexes)
  })
  .catch(err => console.log(err))
})

import util from 'util'
import Promise from 'lie'

export default createIndex

// TODO: We can not use a tags index here because it causes an error
// and is run in memory anyways
// see: https://github.com/nolanlawson/pouchdb-find/issues/153
// and: https://github.com/nolanlawson/pouchdb-find/issues/116 
export const idxStart  = {
  index: {
    fields: ['startArr']
  }
}

export const idxVersion = {
  index: {
    fields: ['version'] 
  }
}

function createIndex (db) {
  const promise = Promise.all([
    db.createIndex(idxStart),
    db.createIndex(idxVersion)
  ]).then(indexes => {
    db.emit('indexed', indexes)  
    return indexes
  })

  return promise
}


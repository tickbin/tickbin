export default createIndex
export const ddoc = {
  _id: '_design/entry_index',
  views: {
    by_from: {
      map: mapFrom.toString()
    },
    by_version: {
      map: mapVersion.toString()  
    }
  }
}

function createIndex (dbName) {
  return dbName.get(ddoc._id)
  .then(doc => { 
    let newddoc = ddoc
    newddoc._rev = doc._rev
    return dbName.put(newddoc) 
  }, err => {
    return dbName.put(ddoc)
  })
}

function mapFrom (doc) {
  emit(doc.fromArr)
}

function mapVersion (doc) {
  var version = 0
  if (doc.version) { 
    version = doc.version
  }

  emit(version)
}


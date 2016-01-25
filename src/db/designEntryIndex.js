export default createIndex
export const ddoc = {
  _id: '_design/entry_index',
  version: 1,
  views: {
    by_from: {
      map: function(doc) {
        emit(doc.fromArr)
      }.toString()
    },
    by_version: {
      map: function(doc) {
        
        var version = 0
        if (doc.version) { 
          version = doc.version
        }

        emit(version)
      }.toString()  
    }
  }
}

function createIndex (dbName) {
  return dbName.get(ddoc._id)
  .then(doc => { 
    if (doc.version >= ddoc.version) return doc

    let newddoc = ddoc
    newddoc._rev = doc._rev
    return dbName.put(newddoc) 
  }, err => {
    return dbName.put(ddoc)
  })
}

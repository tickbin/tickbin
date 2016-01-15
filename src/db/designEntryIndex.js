export default createIndex
export const ddoc = {
  _id: '_design/entry_index',
  views: {
    by_from: {
      map: mapFrom.toString()
    } 
  }
}

function createIndex (dbName) {
  return dbName.put(ddoc) 
}

function mapFrom (doc) {
  emit(doc.fromArr)
}


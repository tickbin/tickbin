import util from 'util'
import Promise from 'lie'

export default createIndex
//export const ddoc = {
  //_id: '_design/entry_index',
  //version: 2,
  //views: {
    //by_start: {
      //map: function(doc) {
        //emit(doc.startArr)
      //}.toString()
    //},
    //by_version: {
      //map: function(doc) {
        
        //var version = 0
        //if (doc.version) { 
          //version = doc.version
        //}

        //emit(version)
      //}.toString()  
    //}
  //}
//}

//function createIndex (dbName) {
  //return dbName.get(ddoc._id)
  //.then(doc => { 
    //if (doc.version >= ddoc.version) return doc

    //let newddoc = ddoc
    //newddoc._rev = doc._rev
    //return dbName.put(newddoc) 
  //}, err => {
    //return dbName.put(ddoc)
  //})
//}

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

export const idxStartTag = {
  index: {
    fields: ['startArr', 'tags'] 
  }
}

export const idxTags = {
  index: {
    fields: ['tags'] 
  }
}

function createIndex (db) {
  const promise = Promise.all([
    db.createIndex(idxStart),
    db.createIndex(idxVersion),
    //db.createIndex(idxStartTag),
    //db.createIndex(idxTags)
  ]).then(indexes => {
    db.emit('indexed', indexes)  
    return indexes
  })

  return promise
}


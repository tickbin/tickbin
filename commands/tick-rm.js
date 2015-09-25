export default rm

import Entry from '../entry'
import PouchDB from 'pouchdb'
import {write} from './output'

let db = new PouchDB('tickbin')

function rm (yargs) {
  let argv = yargs
    .usage('tick rm entryid')
    .argv

  db.get(argv._[1])
  .then(removeEntry)
}

function removeEntry (doc) {
  const e = Entry.fromJSON(doc)
  write(e)
  return db.remove(doc).then(result => { console.log('removed') })
}

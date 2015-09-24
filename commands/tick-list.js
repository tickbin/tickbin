export default list

import Entry from '../entry'
import PouchDB from 'pouchdb'
import {write} from './output'
import moment from 'moment'

let db = new PouchDB('tickbin')

function list (yargs) {
  let argv = yargs
  .usage('tick list')
  .help('h')
  .alias('h', 'help')
  .argv

  db.query(mapDate, {
    include_docs: true,
    descending: true
  }).then(writeEntries)

}

function mapDate (doc) {
  emit(doc.fromArr)
}

function writeEntries (results) {
  let prevDate = null
  results.rows.forEach(function(row) {
    const e = Entry.fromJSON(row.doc)
    if (!moment(prevDate).isSame(e.from, 'day'))
      console.log(moment(e.from).format('ddd, MMM DD, YYYY'))
    prevDate = e.from
    // this is likely slow as it requires creating a new entry
    // but write requires an instatiated Entry at the moment
    write(Entry.fromJSON(row.doc))     
  })

}

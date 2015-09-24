export default list

import Entry from '../entry'
import PouchDB from 'pouchdb'
import {write} from './output'
import moment from 'moment'
import _ from 'lodash'

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
  let dat = _.chain(results.rows)
  .map(row => { return Entry.fromJSON(row.doc) })
  .groupBy(e => { return moment(e.from).startOf('day').format('YYYY-MM-DD') })
  .map((group, d) => { 
    return { 
      ticks: group, 
      date: moment(d, 'YYYY-MM-DD').toDate(),
      minutes: _.reduce(group, (sum, e) => { return sum + e.duration.minutes }, 0)
    }
  })
  .each(group => {
    console.log(moment(group.date).format('ddd, MMM DD, YYYY') + ' ' + group.minutes)
    group.ticks.forEach(write)
  })
  .value()
}

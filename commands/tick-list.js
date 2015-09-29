export default list

import Entry from '../entry'
import PouchDB from 'pouchdb'
import {getOutputs} from './output'
import moment from 'moment'
import _ from 'lodash'
import chalk from 'chalk'
import format from '../time'
import conf from '../config'

let db = new PouchDB(conf.db)

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
    const date = moment(group.date).format('ddd, MMM DD, YYYY')
    const time = format(group.minutes)
    console.log(`${chalk.yellow(date)} ${chalk.green(time)}`)
    group.ticks.forEach(t => { console.log(getOutputs(t).simple) })
  })
  .value()
}

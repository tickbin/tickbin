export default list

import Entry from '../entry'
import {getOutputs} from './output'
import moment from 'moment'
import _ from 'lodash'
import chalk from 'chalk'
import format from '../time'
import db from '../db'

function list (yargs) {
  let argv = yargs
  .usage('Usage: tick list [options]')
  .option('t', {
    alias: 'tag',
    describe: 'tags to filter as boolean AND (no # symbol - e.g. -t tag1 tag2)',
    type: 'array'
  })
  .help('h')
  .alias('h', 'help')
  .argv

  db.query(mapDate, {
    include_docs: true,
    descending: true
  }).then(_.partial(writeEntries, hashTags(argv.tag)))

}

function hashTags(tags = []) {
  // add a # before the tag if it doesn't already exist
  return tags.map(tag => tag.startsWith('#') ? tag : '#' + tag)
}

function mapDate (doc) {
  emit(doc.fromArr)
}

function writeEntries (tags = [], results) {
  let prevDate = null
  let dat = _.chain(results.rows)
  .filter(_.partial(filterTags, tags))
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

function filterTags (tags = [], row) {
  if (!tags) // no tags provided, filter nothing
    return true

  const rtags = row.doc.tags || []

  const found = _.every(tags, t => _.includes(rtags, t))
  return found
}

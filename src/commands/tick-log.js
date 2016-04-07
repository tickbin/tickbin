import Entry from '../entry'
import {getOutputs} from './output'
import moment from 'moment'
import _ from 'lodash'
import chalk from 'chalk'
import format from '../time'
import chrono from 'chrono-node'
import db from '../db'
import { parseDateRange } from '../query'
import Query from '../query'
import csvStringify from 'csv-stringify'

export default { builder, handler : log }

function builder(yargs) {
  return yargs
  .usage('Usage: tick log [options]')
  .example('tick log -t sometag -d "Jan 1-31"')
  .example('tick log -d "Jan 1-15" -f csv')
  .option('t', {
    alias: 'tag',
    describe: 'tags to filter as boolean AND (no # symbol - e.g. -t tag1 tag2)',
    type: 'array'
  })
  .option('d', {
    alias: 'date',
    describe: 'date range to filter entries or number of days to display',
    type: 'string'
  })
  .option('f', {
    alias: 'format',
    describe: 'format to display data in',
    choices: ['csv', 'group'],
    type: 'string'
  })
}

function log(argv) {
  let { start, end } = parseDateRange(argv.date)
  start = moment(start).toArray()
  end = moment(end).toArray()

  const query = new Query(db).findEntries({ start, end, tags: argv.tag })

  switch (argv.format) {
    case 'csv':
      query.exec()
        .then(writeCSV)
        .then(writeDefaultMessage)
      break
    default:
      query.groupByDate()
        .exec()
        .then(writeGroup)
        .then(writeDefaultMessage)
      break
  }
}

function writeCSV(results) {
  const data = _.map(results, t => {
    return _.omit(getOutputs(t), ['simple', 'detailed'])
  })

  csvStringify(data, { header: true, eof: false }, (err, output) => {
    console.log(output)
    return results
  })
}

function writeGroup(results) {
  _.each(results, writeEntryGroup)
  return results
}

function writeDefaultMessage(arr) {
  if (arr.length === 0)
    console.log('You have no recent entries in tickbin. '
      + 'Create some with \'tick log\'')
}

function writeEntryGroup(group) {
  const date = moment(group.date).format('ddd, MMM DD, YYYY')
  const duration = format(group.minutes)
  console.log(`${chalk.yellow(date)} ${chalk.green(duration)}`)
  group.ticks.forEach(t => { console.log(getOutputs(t).simple) })
}

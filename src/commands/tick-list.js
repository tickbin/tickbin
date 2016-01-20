export default list

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

function list (yargs) {
  let argv = yargs
  .usage('Usage: tick list [options]')
  .option('t', {
    alias: 'tag',
    describe: 'tags to filter as boolean AND (no # symbol - e.g. -t tag1 tag2)',
    type: 'array'
  })
  .option('d', {
    alias: 'date',
    describe: 'date range to filter entries or number of days to list',
    type: 'string'
  })
  .help('h')
  .alias('h', 'help')
  .argv

  let { start, end } = parseDateRange(argv.date)
  start = moment(start).toArray()
  end = moment(end).toArray()

  new Query(db)
    .findEntries({ start, end, tags: argv.tag })
    .groupByDate()
    .exec()
    .then(groups => {
      _.each(groups, writeEntryGroup) 
      return groups
    })
    .then(arr => {
      if (arr.length === 0)
        console.log('You have no recent entries in tickbin. ' 
          + 'Create some with \'tick log\'')
  })
}

function writeEntryGroup (group) {
  const date = moment(group.date).format('ddd, MMM DD, YYYY')
  const duration = format(group.minutes)
  console.log(`${chalk.yellow(date)} ${chalk.green(duration)}`)
  group.ticks.forEach(t => { console.log(getOutputs(t).simple) })
}

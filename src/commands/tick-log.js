import {getOutputs} from './output'
import moment from 'moment'
import _ from 'lodash'
import chalk from 'chalk'
import format from '../time'
import chrono from 'chrono-node'
import db from '../db'
import Query from '../query'
import csvStringify from 'csv-stringify'

export default { builder, handler : log }

function builder(yargs) {
  return yargs
  .usage('Usage: tick log [options]')
  .example('tick log -f "#tag1 and #tag2 Jan 1-31"')
  .example('tick log -f "#tag1 or #tag2 Jan - Feb"')
  .example('tick log -f "#tag1 and not #tag2 Jan - Feb"')
  .example('tick log -f "Jan 1-15" -f csv')
  .option('t', {
    alias: 'type',
    describe: 'type to display data in',
    choices: ['csv', 'json', 'text'],
    default: 'text',
    type: 'string'
  })
  .option('f', {
    alias: 'filter',
    describe: 'filter entries (e.g. #tag1 and #tag2)',
    type: 'string'
  })
  .option('hide-details', {
    describe: 'hide the entry details',
    type: 'boolean'
  })
}

function log(argv) {
  const query = new Query(db).findEntries(argv.filter)

  switch (argv.type) {
    case 'csv':
      query.exec()
        .then(writeCSV)
        .then(writeDefaultMessage)
      break
    case 'json':
      query.exec()
        .then(writeJSON)
      break
    case 'text':
    default:
      query.groupByDate()
        .exec()
        .then(group => writeGroup(group, argv.hideDetails))
        .then(writeDefaultMessage)
        .catch(console.error)
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

function writeJSON(results) {
  const out = results.map(tick => tick.toObject())
  console.log(JSON.stringify(out, null, 2))
  return results
}

function writeGroup(results, hideDetails = false) {
  results.forEach(r => {
    writeEntryGroup(r, hideDetails) 
  })
  return results
}

function writeDefaultMessage(arr) {
  if (arr.length === 0)
    console.log('No entries found in tickbin. '
      + 'Create some with \'tick commit\'')
}

function writeEntryGroup(group, hideDetails = false) {
  const date = moment(group.date).format('ddd, MMM DD, YYYY')
  const duration = format(group.minutes)
  console.log(`${chalk.yellow(date)} ${duration}`)

  if (!hideDetails) {
    group.ticks.forEach(t => console.log(`  ${getOutputs(t).simple}`))
  }
}


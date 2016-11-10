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
  .example('tick log -f "Jan 1-15" -t csv')
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
  .option('hide-summary', {
    describe: 'hide the daily summary',
    type: 'boolean'
  })
  .option('sum', {
    describe: 'sum of hours being logged',
    type: 'boolean'
  })
}

function log(argv) {
  let query
  try {
    query = new Query(db).findEntries(argv.filter)
  } catch(e){
    return writeFilterError()
  }
  switch (argv.type) {
    case 'csv':
      query.exec()
        .then(sortByCreatedFrom)
        .then(writeCSV)
        .then(writeDefaultMessage)
      break
    case 'json':
      query.exec()
        .then(sortByCreatedFrom)
        .then(writeJSON)
      break
    case 'text':
    default:
      query.groupByDate()
        .exec()
        .then(sortGroupsByCreatedFrom)
        .then(group => writeGroup(group, argv.hideDetails, argv.hideSummary))
        .then(results => writeSum(results, argv.sum))
        .then(writeDefaultMessage)
        .catch(console.error)
      break
  }
}

/*
 * Ticks are already sorted by start. We need to move the duration type ticks
 * to the top of the sorted list and order them by ref.
 */
function sortByCreatedFrom(ticks) {
  const durationTicks = _.chain(ticks)
  .remove(['createdFrom', 'duration'])
  .sortBy('ref')

  return [...durationTicks, ...ticks]
}

function sortGroupsByCreatedFrom(results) {
  return results.map(group => {
    group.ticks = sortByCreatedFrom(group.ticks)

    return group
  })
}

function writeSum(results, shouldWriteSum) {
  if (!shouldWriteSum) return results

  //  Calculate the sum of all the days
  const sumMinutes = _.reduce(results, (sum, d) => sum + d.minutes, 0)

  const hours = Math.floor(sumMinutes / 60)
  const minutes = sumMinutes % 60

  console.log(`Total: ${hours}h${minutes}m`)

  return results
}

function writeFilterError() {
  console.log('There was an error while parsing the filter. '
  + 'Here are some examples of a valid filter:'
  + '\n  tick log -f "#tag1 and #tag2 Jan 1-31"'
  + '\n  tick log -f "#tag1 or #tag2 Jan - Feb"'
  + '\n  tick log -f "#tag1 and not #tag2 Jan - Feb"'
  + '\n  tick log -f "Jan 1-15" -f csv"')
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

function writeGroup(results, hideDetails = false, hideSummary = false) {
  results.forEach(r => {
    writeEntryGroup(r, hideDetails, hideSummary)
  })
  return results
}

function writeDefaultMessage(arr) {
  if (arr.length === 0)
    console.log('No entries found in tickbin. '
      + 'Create some with \'tick commit\'')
}

function writeEntryGroup(group, hideDetails = false, hideSummary = false) {
  const date = moment(group.date).format('ddd, MMM DD, YYYY')
  const duration = format(group.minutes)

  if (!hideSummary) {
    console.log(`${chalk.yellow(date)} ${duration}`)
  }

  if (!hideDetails) {
    if (hideSummary) {
      group.ticks.forEach(t => console.log(`${getOutputs(t).detailed}`))
    } else {
      group.ticks.forEach(t => console.log(`  ${getOutputs(t).simple}`))
    }
  }

}

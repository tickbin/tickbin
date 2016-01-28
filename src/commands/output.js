import moment from 'moment'
import chalk from 'chalk'
import format from '../time'
import pad from 'pad'
import Entry from '../entry'
import { hashPattern } from '../entry'

export { writeSaved }
export { writeRemove }
export {getOutputs as getOutputs}

function writeSaved (doc) {
  const entry = Entry.fromJSON(doc)
  const { detailed } = getOutputs(entry)
  console.log(chalk.bgGreen('saved'), detailed)
}

function writeRemove (doc) {
  const entry = Entry.fromJSON(doc)
  const { detailed } = getOutputs(entry)
  console.log(chalk.bgRed('removed'), detailed)
}

function getOutputs(entry) {
  const timePattern = new RegExp(/\s*/.source + entry.time + /\s*/.source, 'g')
  const id = `${chalk.gray(pad(entry._id, 10))}`
  const date = `${chalk.yellow(pad(moment(entry.start).format('ddd MMM DD'),9))}`
  const timeStart = moment(entry.start)
  const timeEnd = moment(entry.end)
  const time = `${timeStart.format('hh:mma')}-${timeEnd.format('hh:mma')}`
  const duration = chalk.green(format(entry.duration.minutes))
  const msg = entry.message
    .replace(hashPattern, chalk.cyan('$1'))
    .replace(timePattern, ' ')
    .trim()
  const tags = chalk.cyan([...entry.tags].join(' '))

  const detailed = `${id} ${date} ${time} ${duration} ${msg}`
  const simple = `${id} ${time} ${duration} ${msg}`

  return {id, date, duration, msg, tags, detailed, simple}
}

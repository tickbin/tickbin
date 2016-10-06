import moment from 'moment'
import chalk from 'chalk'
import format from '../time'
import pad from 'pad/lib/colors'
import { Entry } from 'tickbin-parser'

export { writeSaved }
export { writeRemove }
export { getOutputs }
export { writeTimer }
export { writeSavedTimer }
export { writeRemoveTimer }
export { getTimerOutput }

const hashPattern = /(#\w+[\w-]*)/g

function writeSaved(doc) {
  const entry = Entry.fromObject(doc)
  const { detailed } = getOutputs(entry)
  console.log(chalk.green('+'), detailed)
}

function writeRemove(doc) {
  const entry = Entry.fromObject(doc)
  const { detailed } = getOutputs(entry)
  console.log(chalk.red('-'), detailed)
}

function getOutputs(entry) {
  const timePattern = new RegExp(/\s*/.source + entry.time + /\s*/.source, 'g')
  const id = chalk.gray(entry._id)
  const date = chalk.yellow(moment(entry.start).format('ddd MMM DD'))
  const timeStart = moment(entry.start)
  const timeEnd = moment(entry.end)
  const time = entry.createdFrom === 'duration' ?
    pad('', 15, '-') :
    `${timeStart.format('hh:mma')}-${timeEnd.format('hh:mma')}`
  const duration = format(entry.duration.minutes)
  const seconds = entry.duration.seconds
  const msg = entry.message
    .replace(hashPattern, chalk.cyan('$1'))
    .trim()
  const tags = chalk.cyan([...entry.tags].join(' '))
  const detailed = `${pad(id, 9)} ${pad(date, 9)} ${time} ${duration} ${msg}`
  const simple = `${pad(id, 9)} ${time} ${duration} ${msg}`

  return {id, date, seconds, msg, tags, detailed, simple}
}

function writeTimer(timer) {
  const output = getTimerOutput(timer)
  console.log(`◷ ${output}`)
}

function writeSavedTimer(timer) {
  const clockIcon = chalk.green('+ ◷')
  const output = getTimerOutput(timer)
  console.log(clockIcon, output)
}

function writeRemoveTimer(timer) {
  const clockIcon = chalk.red('- ◷')
  const output = getTimerOutput(timer)
  console.log(clockIcon, output)
}

function getTimerOutput({ start, message = '' }) {
  const date = chalk.yellow(moment(start).format('ddd MMM DD'))
  const time = moment(start).format('hh:mma')
  const msg = message
    .replace(hashPattern, chalk.cyan('$1'))
    .trim()
  return `${pad(date, 9)} ${time} ${msg}`
}

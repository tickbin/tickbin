import moment from 'moment'
import chalk from 'chalk'
import format from '../time'
import pad from 'pad'

export {write as write}
export {getOutputs as getOutputs}

function write(entry) {
  const {detailed} = getOutputs(entry)

  console.log(detailed)
}

function getOutputs(entry) {
  const timePattern = new RegExp(/\s*/.source + entry.time + /\s*/.source, 'g')
  const id = `${chalk.gray(pad(entry._id, 10))}`
  const date = `${chalk.yellow(pad(moment(entry.from).format('ddd MMM DD'),9))}` 
  const timeFrom = moment(entry.from)
  const timeTo = moment(entry.to)
  const time = `${timeFrom.format('hh:mma')}-${timeTo.format('hh:mma')}`
  const duration = chalk.green(format(entry.duration.minutes))
  const msg = entry.message
    .replace(/\s*#\w+\s*/g, '')
    .replace(timePattern, '')
  const tags = chalk.cyan([...entry.tags].join(' '))

  const detailed = `${id} ${date} ${time} ${duration} ${msg} ${tags}`
  const simple = `${id} ${time} ${duration} ${msg} ${tags}`

  return {id, date, duration, msg, tags, detailed, simple}
}

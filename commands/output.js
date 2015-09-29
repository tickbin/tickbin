import moment from 'moment'
import chalk from 'chalk'
import format from '../time'

export {write as write}
export {getOutputs as getOutputs}

function write(entry) {
  const {detailed} = getOutputs(entry)

  console.log(detailed)
}

function getOutputs(entry) {
  const id = `${chalk.gray(entry._id)}`
  const date = `${chalk.yellow(moment(entry.from).format('ddd MMM DD'))}` 
  const time = chalk.green(format(entry.duration.minutes))
  const msg = `${entry.message}` 
  const detailed = `${id} ${date} ${time} ${msg}`
  const simple = `${id} ${time} ${msg}`

  return {id, date, time, msg, detailed, simple}
}

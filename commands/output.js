export {write as write}
import moment from 'moment'
import chalk from 'chalk'
import format from '../time'

function write(entry) {
  const id = `${chalk.gray(entry._id)}`
  const date = `${chalk.yellow(moment(entry.from).format('ddd MMM DD'))}` 
  const time = chalk.green(format(entry.duration.minutes))
  const msg = `${entry.message}` 
  console.log(`${id} ${date} ${time} ${msg}`)
}

export {write as write}
import moment from 'moment'
import chalk from 'chalk'

function write(entry) {
  console.log(`${chalk.gray(entry._id)} ${chalk.yellow(moment(entry.from).format('ddd MMM DD'))} ${entry.message}`)
}

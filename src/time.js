export default format
import pad from 'pad'
import chalk from 'chalk'

function format (minutes) {
  const hours = chalk.green(pad(2, Math.floor(minutes / 60)))
  const mins = chalk.green(pad(2, minutes % 60))

  const h = chalk.green('h')
  const m = chalk.green('m')
  return `${hours}${h}${mins}${m}`
}

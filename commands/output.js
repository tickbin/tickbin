export {write as write}
import moment from 'moment'

function write(entry) {
  console.log(`${entry._id} ${moment(entry.from).format('ddd MMM DD')} ${entry.message}`)
}

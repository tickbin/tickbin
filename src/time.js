export default format
import pad from 'pad'

function format (minutes) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  return `${hours}h ${mins}m`
}

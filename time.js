export default format
import pad from 'pad'

function format (minutes) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  return `${pad(2, hours)}h ${pad(2,mins)}m`
}

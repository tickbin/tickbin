
import chrono from 'chrono-node'
import militaryParser from './parsers/militaryParser'
import orderRefiner from './refiners/orderRefiner'

const parser = new chrono.Chrono()
parser.parsers.push(militaryParser)
parser.refiners.push(orderRefiner)

export default function(str, ref) {
  let rslt = parser.parse(str, ref)[0]
  let start = rslt.start.date()
  let end = rslt.end.date()
  return { start, end, }
}

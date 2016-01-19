
import chrono from 'chrono-node'
import militaryParser from './parsers/militaryParser'
import orderRefiner from './refiners/orderRefiner'

const parser = new chrono.Chrono()
parser.parsers.push(militaryParser)
parser.refiners.push(orderRefiner)

export default function(str, ref) {
  let rslt = parser.parse(str, ref)[0]
  let isValid = rslt && rslt.start && rslt.end
  let start = isValid ? rslt.start.date() : null
  let end = isValid ? rslt.end.date() : null
  let text = isValid ? rslt.text : null
  return { start, end, text, isValid, }
}

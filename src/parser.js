
import chrono from 'chrono-node'
import militaryParser from './parsers/militaryParser'
import requireMeridiemRefiner from './refiners/requireMeridiemRefiner'
import impliedAMEndRefiner from './refiners/impliedAMEndRefiner'
import impliedPMStartRefiner from './refiners/impliedPMStartRefiner'
import dayOverlapRefiner from './refiners/dayOverlapRefiner'

const parser = new chrono.Chrono(chrono.options.casualOption())
parser.parsers.push(militaryParser)
parser.refiners.push(requireMeridiemRefiner)
parser.refiners.push(impliedAMEndRefiner)
parser.refiners.push(impliedPMStartRefiner)
parser.refiners.push(dayOverlapRefiner)

export default function(str, ref) {
  let rslt = parser.parse(str, ref)[0]
  let isValid = rslt && rslt.start && rslt.end
  let start = isValid ? rslt.start.date() : null
  let end = isValid ? rslt.end.date() : null
  let text = isValid ? rslt.text : null
  return { start, end, text, isValid, }
}

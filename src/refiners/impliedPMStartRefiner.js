/*
 * When specifying a meridiem for the end time and no meridiem for start,
 * chrono implies start is also in PM and sets end as then next day. This is
 * usually not the case.
 *
 *   '10-4pm should parse to '10am-4pm'
 *   '9:30-12pm should parse to '9:30am-12pm'
 *
 * See https://github.com/MemoryLeaf/tickbin/issues/96
 * and https://github.com/MemoryLeaf/tickbin/issues/42
 */

import chrono from 'chrono-node'
import { subtract } from '../helpers/chronoDateManipulation'

function refine (text, results, opt) {
  results.forEach(result => {
    if (!result.start.isCertain('meridiem')
        && result.end.isCertain('meridiem')
        && result.end.get('meridiem') === 1
        && result.start.get('hour') > result.end.get('hour')) {
      result.start.assign('meridiem', 0)
      subtract(12, 'hour', result.start)
      subtract(1, 'day', result.end)
    }
  })
  return results
}

const impliedPMStartRefiner = new chrono.Refiner()
impliedPMStartRefiner.refine = refine
export default impliedPMStartRefiner

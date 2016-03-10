/*
 * When specifying a meridiem for the end time and no meridiem for start, it
 * implies start is also in PM and sets end as then next day. This is usually
 * not the case.
 *
 * Refine the implied PM back to AM.
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

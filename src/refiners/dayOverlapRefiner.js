/*
 * When entering a time that overlaps two days (11pm-2am) the start date should
 * refer to the day before when no reference date is supplied.
 *
 * If the date is Jan 15 and no reference date is supplied (or it's the current
 * date):
 *   '11pm-2am' should parse to 'Jan 14 11pm - Jan 15 2am'
 *
 * If a reference date (Jan 1) is specified (that is not the current date):
 *   '11pm-2am' should parse as 'Jan 1 11pm - Jan 2 2am'
 *   Note: This is how the parser works by default
 *
 * See https://github.com/tickbin/tickbin/issues/26
 */

import chrono from 'chrono-node'
import { subtract } from '../helpers/chronoDateManipulation'
import moment from 'moment'

function refine (text, results, opt) {
  let today = new Date()

  results.forEach(result => {
    // only operate on ranges
    if (!result.start || !result.end)
      return result

    if (moment(result.ref).isSame(today, 'day')
        && result.start.get('meridiem') === 1
        && result.end.get('meridiem') === 0) {
      subtract(1, 'day', result.start)
      subtract(1, 'day', result.end)
    }
  })
  return results
}

const dayOverlapRefiner = new chrono.Refiner()
dayOverlapRefiner.refine = refine
export default dayOverlapRefiner

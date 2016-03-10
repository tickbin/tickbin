
import chrono from 'chrono-node'
import { subtract } from '../helpers/chronoDateManipulation'

function refine(text, results, opt) {
  results.forEach(result => {
    if (result.start.date() > result.end.date()) {
      subtract(1, 'day', result.start)
    }
  })
  return results
}

const orderRefiner = new chrono.Refiner()
orderRefiner.refine = refine
export default orderRefiner


import chrono from 'chrono-node'

function refine(text, results, opt) {
  results.forEach(result => {
    if (result.start.date() > result.end.date()) {
      result.start.assign('day', result.start.get('day') - 1)
    }
  })
  return results
}

const orderRefiner = new chrono.Refiner()
orderRefiner.refine = refine
export default orderRefiner

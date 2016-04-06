import chrono from 'chrono-node'
import NoMeridiemError from '../errors/NoMeridiemError'

const requireMeridiemRefiner = new chrono.Refiner()
requireMeridiemRefiner.refine = refine
export default requireMeridiemRefiner

function refine (text, results, opt) {
  results.forEach(result => {
    if (!result.start || !result.end) 
      return result // only operate on ranges

    if (!result.start.isCertain('meridiem') 
        && !result.end.isCertain('meridiem'))
      throw new NoMeridiemError()

  })
  return results 
}

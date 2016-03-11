/*
 * Use moment add() and subtract() to properly increment chrono start/end
 * values.
 *
 * Since changing one property on a chrono parsedComponent does not affect any
 * of the other properties (ie if the hour property is greater than 23, it does
 * not update the day field to be one day ahead. This could cause problems when
 * passing the parsedComponent through multiple refiners.
 *
 * For example, if one refiner was to increment the hour property to be greater
 * thank 23, and then the next refiner was to do a check based on the day
 * property, it may give unexplected results.
 */

/*
 * Dictionary to convert chrono time unit keys to monent unit keys. Map chrono
 * and moments inconsistantcies (ie 'day' in chrono is the same as 'date' in
 * moment).
 */
const dictChronoMoment = {
  year: 'year',
  month: 'month',
  day:'date',
  hour: 'hour',
  minute: 'minute',
  second: 'second',
  millisecond: 'millisecond'
}

function add (duration, unit, chronoParsedComponent) {
  const newTime = chronoParsedComponent.moment().add(duration, unit)
  assignToParsedComponent(newTime, chronoParsedComponent)
}

function subtract (duration, unit, chronoParsedComponent) {
  const newTime = chronoParsedComponent.moment().subtract(duration, unit)
  assignToParsedComponent(newTime, chronoParsedComponent)
}

function assignToParsedComponent (newTime, chronoParsedComponent) {
  for (const key in dictChronoMoment) {
    let newValue = newTime.get(dictChronoMoment[key])
    if (key === 'month') newValue++ //  Month is stored with index 0 in moment

    if (key in chronoParsedComponent.impliedValues) {
      chronoParsedComponent.imply(key, newValue)
    }
    if (key in chronoParsedComponent.knownValues) {
      chronoParsedComponent.assign(key, newValue)
    }
  }
}

export { add }
export { subtract }

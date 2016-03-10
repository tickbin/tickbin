/*
 * Use moment add() and subtract() to properly increment chrono start/end
 * values
 */

const validKeys = {
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
  for (const key in validKeys) {
    let newValue = newTime.get(validKeys[key])
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

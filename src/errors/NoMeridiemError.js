import ExtendableError from 'es6-error'

export default class NoMeridiemError extends ExtendableError {
  constructor(message = 'No meridiem specified') {
    super(message) 
  }
}

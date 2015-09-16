'use strict'

import Duration from 'duration'
import durate, {pattern} from 'durate'
import shortid from 'shortid'

module.exports = class Entry {
  constructor(message, opts = {}) {
    let {
      date = new Date(), 
    } = opts

    this._id = shortid.generate()
    this.message = message
    this.parseDurate(message, date)
  }

  parseDurate(msg, anchor) {
    if (pattern.test(msg)) {
      this.setDates(durate(msg, anchor))
    }
  }

  setDates(opts) {
    this.hasDates = true
    this.startDate = opts.start
    this.endDate = opts.end
    this.duration = new Duration(this.startDate, this.endDate)
  }

  getDates() {
    let start = this.startDate
    let end = this.endDate
    return {start, end}
  }

  toJSON() {
    return {
      _id: this._id,
      message: this.message,
      hasDates: this.hasDates,
      startDate: this.startDate,
      endDate: this.endDate,
      duration: {
        seconds: this.duration.seconds,
        from: this.duration.from,
        to: this.duration.to
      }
    } 
  }
}

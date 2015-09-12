'use strict'

import durate, {pattern} from 'durate'

module.exports = class Entry {
  constructor(message, opts = {}) {
    let {
      date = new Date(), 
    } = opts
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
  }

  getDates() {
    let start = this.startDate
    let end = this.endDate
    return {start, end}
  }
}

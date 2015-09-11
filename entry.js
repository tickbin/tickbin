'use strict'

import durate, {pattern} from 'durate'

module.exports = class Entry {
  constructor(msg) {
    this.original = msg
    this.parseDurate(msg)
  }

  parseDurate(msg) {
    if (pattern.test(msg)) {
      this.setDates(durate(msg))
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

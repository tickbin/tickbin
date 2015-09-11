'use strict'

import durate, {pattern} from 'durate'

module.exports = class Entry {
  constructor(str) {
    this.original = str
    this.parseDurate(str)
  }

  parseDurate(str) {
    if (pattern.test(str)) {
      this.setDates(durate(this.original))
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

'use strict'

import durate, {pattern} from 'durate'

module.exports = class Entry {
  constructor(msg, opts = {}) {
    let {
      anchor = new Date(), 
    } = opts
    this.original = msg
    this.parseDurate(msg, anchor)
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

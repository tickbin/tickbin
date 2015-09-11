'use strict'

import {durate} from 'durate'

module.exports = class Entry {
  constructor(str) {
    this.original = str
    this.setDates(durate(this.original))
  }

  setDates(opts) {
    this.startDate = opts.start
    this.endDate = opts.end
  }

  getDates() {
    let start = this.startDate
    let end = this.endDate
    return {start, end}
  }
}

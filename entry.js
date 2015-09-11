'use strict'

module.exports = class Entry {
  constructor(str) {
    this.original = str
    this.startDate = new Date()
    this.endDate = new Date()

    this.startDate.setHours(8)
    this.endDate.setHours(17)
  }

  getDates() {
    let start = this.startDate
    let end = this.endDate
    return {start, end}
  }
}

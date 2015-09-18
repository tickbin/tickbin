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
    this.from = opts.start
    this.to = opts.end
    this.duration = new Duration(this.from, this.to)
  }

  getDates() {
    let from = this.from
    let to = this.to
    return {from, to}
  }

  toJSON() {
    return {
      _id: this._id,
      message: this.message,
      hasDates: this.hasDates,
      from: this.from,
      to: this.to,
      duration: {
        seconds: this.duration.seconds,
        from: this.duration.from,
        to: this.duration.to
      }
    } 
  }
}

'use strict'

import Duration from 'duration'
import durate, {pattern} from 'durate'
import shortid from 'shortid'
import moment from 'moment'

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
    this.fromArr = moment(this.from).toArray()
    this.to = opts.end
    this.toArr = moment(this.to).toArray()
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
      fromArr: this.fromArr,
      to: this.to,
      toArr: this.toArr,
      duration: {
        seconds: this.duration.seconds,
        from: this.duration.from,
        to: this.duration.to
      }
    } 
  }

  static fromJSON(doc) {
    let e = new Entry(doc.message)
    e._id = doc._id

    return e;
  }
}

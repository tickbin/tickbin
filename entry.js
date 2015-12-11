'use strict'

import Duration from 'duration'
import durate, {pattern} from 'durate'
import shortid from 'shortid'
import moment from 'moment'
import uniq from 'lodash/array/uniq'

const hashPattern = /#\w+/g

module.exports = class Entry {
  constructor(message, opts = {}) {
    let {
      date = new Date(), 
    } = opts

    if (typeof message === 'object')
      return this._fromJSON(message)

    this._id = shortid.generate()
    this.message = message
    this.parseDurate(message, date)
    this.parseTags(message)
  }

  _fromJSON(doc) {
    Object.assign(this, doc)
    const start = new Date(this.from)
    const end = new Date(this.to)
    this.setDates({start, end})
    return this
  }

  parseDurate(msg, date) {
    if (pattern.test(msg)) {
      this.setDates(durate(msg, date))
    }
  }

  parseTags(message) {
    this.tags = uniq(message.match(hashPattern))
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
      },
      tags: this.tags.slice()
    } 
  }

  static fromJSON(doc) {
    let e = new Entry(doc)

    return e;
  }
}

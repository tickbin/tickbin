import Duration from 'duration'
import shortid from 'shortid'
import moment from 'moment'
import parser from './parser'

const hashPattern = /#\w+/g

export default class Entry {
  constructor(message, opts = {}) {
    let {
      date = new Date(), 
    } = opts

    if (typeof message === 'object')
      return this._fromJSON(message)

    this._id = shortid.generate()
    this.message = message
    this.parse(message, date)
    this.parseTags(message)
  }

  _fromJSON(doc) {
    Object.assign(this, doc)
    const start = new Date(this.from)
    const end = new Date(this.to)
    const text = this.time
    this.setDates({start, end, text})
    this.tags = new Set(doc.tags)
    return this
  }

  parse(msg, date) {
    let d = parser(msg, date)
    if (d.isValid) this.setDates(d)
  }

  parseTags(message) {
    // Set makes things unique
    this.tags = new Set(message.match(hashPattern))
  }

  setDates(opts) {
    this.hasDates = true
    this.from = opts.start
    this.fromArr = moment(this.from).toArray()
    this.to = opts.end
    this.time = opts.text
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
      time: this.time,
      tags: [...this.tags],
      duration: {
        seconds: this.duration.seconds,
        from: this.duration.from,
        to: this.duration.to
      }
    } 
  }

  static fromJSON(doc) {
    let e = new Entry(doc)

    return e
  }
}

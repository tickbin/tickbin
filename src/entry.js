import Duration from 'duration'
import shortid from 'shortid'
import moment from 'moment'
import parser from './parser'

export const hashPattern = /(#\w+[\w-]*)/g
export const version = 3
export default class Entry {
  constructor(message, opts = {}) {
    let {
      date = new Date(), 
    } = opts

    if (typeof message === 'object')
      return this._fromJSON(message)

    this.version = version
    this._id = shortid.generate()
    this.message = message
    this.parse(message, date)
    this.parseTags(message)
  }

  _fromJSON(doc) {
    Object.assign(this, doc)
    const start = new Date(this.start)
    const end = new Date(this.end)
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
    this.start = opts.start
    this.startArr = moment(this.start).toArray()
    this.end = opts.end
    this.endArr = moment(this.end).toArray()
    this.time = opts.text
    this.duration = new Duration(this.start, this.end)
  }

  getDates() {
    let start = this.start
    let end = this.end
    return { start, end }
  }

  toJSON() {
    return {
      _id: this._id,
      version: this.version,
      message: this.message,
      hasDates: this.hasDates,
      start: this.start,
      startArr: this.startArr,
      end: this.end,
      endArr: this.endArr,
      time: this.time,
      tags: [...this.tags],
      duration: this.duration ? {
        seconds: this.duration.seconds,
        from: this.duration.from,
        to: this.duration.to
      } : null
    } 
  }

  static fromJSON(doc) {
    let e = new Entry(doc)

    return e
  }
}

import chrono from 'chrono-node'
import moment from 'moment'
import _ from 'lodash'
import every from 'lodash/collection/every'
import includes from 'lodash/collection/includes'
import Entry from './entry'

export { filterTags }
export { hashTags }
export { parseDateRange }
export { groupEntries }

export default class Query {
  constructor (db) {
    if (!db) throw new Error('Please provide a couchdb instance')

    this.db = db
    this.executed = false
  }

  findEntries (start = null, end = null, tags = []) {
    return this 
  }

  groupByDate () {
    return this 
  }

  exec() {
    return this.db.query()
  }
}

function filterTags (tags = [], doc) {
  if (!tags) // no tags provided, filter nothing
    return true

  const docTags = doc.tags || [] 

  const found = every(tags, t => includes(docTags, t))
  return found
}

function hashTags (tags = []) {
  // add a # before the tag if it doesn't already exist
  return tags.map(tag => tag.startsWith('#') ? tag : '#' + tag)
}

function parseDateRange (range) {
  let days = parseInt(range)
  days = days >= 0 ? days : 6 // default 6 days

  let dates = chrono.parse(range)[0] || [{}]
  // by default, set the date range then check if chrono parsed anything good
  let start = moment().subtract(days, 'days').startOf('day').toDate()
  let end   = moment().endOf('day').toDate();
  if (dates.start && dates.end) {
    start = moment(dates.start.date()).startOf('day').toDate()
    end   = moment(dates.end.date()).endOf('day').toDate()
  }

  return { start, end }
}

function groupEntries (docs) {
  return _.chain(docs) 
  .map(doc => Entry.fromJSON(doc))
  .groupBy(e => { return moment(e.from).startOf('day').format('YYYY-MM-DD') })
  .map((group, d) => { 
    return { 
      ticks: group, 
      date: moment(d, 'YYYY-MM-DD').toDate(),
      minutes: _.reduce(group, (sum, e) => { return sum + e.duration.minutes }, 0)
    }
  })
  .value()
}

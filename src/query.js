import chrono from 'chrono-node'
import moment from 'moment'
import _ from 'lodash'
import Entry from './entry'

export { filterTags }
export { hashTags }
export { parseDateRange }

/**
 * Prepare queries on Entries and execute them
 */
export default class Query {

  /**
   * create a new query with some basic setup
   * requires a db instance (which is a pouchDB/couchDB compatible API)
   */
  constructor (db) {
    if (!db) throw new Error('Please provide a couchdb instance')

    this.db = db
    this.isExecuted = false
    this._index = 'entry_index/by_start'
    this._queryOpts = { include_docs: true }
    this._rows = []
    this._chain = _.chain(this._rows) // start a chain on rows
      .map('doc') // each rows has a doc 
  }

  /**
   * prepare query to find entries by date range filtered by tags
   */
  findEntries ({start = null, end = null, tags = [], filter = null} = {}) {
    if ((start || end || tags.length >= 1) && filter) {
      throw new Error(`You can not call findEntries with filter and 
        (start or end or tags)`) 
    } 
    this._queryOpts.descending = true
    this._queryOpts.startkey = end
    this._queryOpts.endkey = start

    this._chain = this._chain.filter(_.partial(filterTags, hashTags(tags)))
      .map(doc => Entry.fromJSON(doc))

    return this 
  }

  /**
   * adds grouping by date to the filter chain
   * causes the result set to be structured as an array of
   * {
   *   entries: [ ], // an array of Entry objects falling within the date
   *   date: aSingleDay, // a single day grouping multiple entries
   *   minutes: sum // a reduction of the minutes of that day's entries
   * }
   */
  groupByDate () {
    this._chain = this._chain
      .groupBy(e => moment(e.start).startOf('day').format('YYYY-MM-DD') )
      .map((group, d) => { 
        return { 
          ticks: group, 
          date: moment(d, 'YYYY-MM-DD').toDate(),
          minutes: _.reduce(group, (sum, e) => sum + e.duration.minutes, 0)
        }
      })

    return this 
  }

  /**
   * execute the prepared query
   * can only be run once per query instance
   */
  exec() {
    if (this.isExecuted) throw new Error ('This query has already been executed')
    
    this.isExecuted = true

    return this.db.query(this._index, this._queryOpts)
      .then(results => {
        this._rows.push(...results.rows) // this._chain is tied to this._rows 
        return this._chain.value() // execute the chain
      })
  }
}

/**
 * helper function to filter a document by a set of tags (using OR)
 * intended to be run as a filter step in a lodash chain
 */
function filterTags (tags = [], doc) {
  if (_.isEmpty(tags)) // no tags provided, filter nothing
    return 'found'

  const docTags = doc.tags || [] 
  const found = _.some(tags, t => _.includes(docTags, t))

  return found
}

/**
 * helper function to add # characters before strings
 */
function hashTags (tags = []) {
  return tags.map(tag => tag.startsWith('#') ? tag : '#' + tag)
}

/**
 * helper function to parse a string date range into start and end dates
 * uses chrono to compute the range defaults to
 * { 
 *   start: 6daysago,
 *   end: today
 * }
 */
function parseDateRange (range) {
  let days = parseInt(range)
  days = days >= 0 ? days : 6 // default 6 days
  let dates = chrono.parse(range)[0] || [{}]
  // by default, set the date range then check if chrono parsed anything good
  let start = moment().subtract(days, 'days').startOf('day').toDate()
  let end   = moment().endOf('day').toDate()
  if (dates.start && dates.end) {
    start = moment(dates.start.date()).startOf('day').toDate()
    end   = moment(dates.end.date()).endOf('day').toDate()
  }

  return { start, end }
}

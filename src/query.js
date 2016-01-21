import chrono from 'chrono-node'
import moment from 'moment'
import _ from 'lodash'
import Entry from './entry'

export { filterTags }
export { hashTags }
export { parseDateRange }

export default class Query {
  constructor (db) {
    if (!db) throw new Error('Please provide a couchdb instance')

    this.db = db
    this.isExecuted = false
    this._index = 'entry_index/by_from'
    this._queryOpts = { include_docs: true }
    this._rows = []
    this._chain = _.chain(this._rows) // start a chain on rows
      .pluck('doc') // each rows has a doc 
  }

  findEntries ({start = null, end = null, tags = []} = {}) {
    this._queryOpts.descending = true
    this._queryOpts.startkey = end
    this._queryOpts.endkey = start

    this._chain = this._chain.filter(_.partial(filterTags, hashTags(tags)))

    return this 
  }

  groupByDate () {
    this._chain = this._chain
      .map(doc => Entry.fromJSON(doc))
      .groupBy(e => moment(e.from).startOf('day').format('YYYY-MM-DD') )
      .map((group, d) => { 
        return { 
          ticks: group, 
          date: moment(d, 'YYYY-MM-DD').toDate(),
          minutes: _.reduce(group, (sum, e) => sum + e.duration.minutes, 0)
        }
      })

    return this 
  }

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

function filterTags (tags = [], doc) {
  if (_.isEmpty(tags)) // no tags provided, filter nothing
    return 'found'

  const docTags = doc.tags || [] 
  const found = _.every(tags, t => _.includes(docTags, t))

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

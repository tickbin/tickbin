import chrono from 'chrono-node'
import wholeMonth from 'chrono-refiner-wholemonth'
import moment from 'moment'
import _ from 'lodash'
import Entry from './entry'
import parseFilter from 'tickbin-filter-parser'
import jouch from 'jouch'

export { filterTags }
export { hashTags }

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
    this._docs = []
    this._chain = _.chain(this._docs) // start a chain on docs
  }

  /**
   * prepare query to find entries by date range filtered by tags
   */
  findEntries (filter = '') {
    // setup a default date filter term for the last 7 days
    const defStart = JSON.stringify(moment().subtract(7, 'days').startOf('day').utc().toArray())
    const defEnd = JSON.stringify(moment().endOf('day').utc().toArray())
    const defaultDatesFilter = `(startArr >= ${defStart} and startArr <= ${defEnd})`

    const {parsed, dates} = parseFilter(filter)

    // check if the filter has dates and build the filter expression
    const filterDates = dates[0] ? dates[0].text : defaultDatesFilter 
    const reconstructed = parsed ? `(${parsed}) and ${filterDates}` : filterDates

    const selector = jouch(reconstructed)
    this._find = {
      selector,
      sort: ['startArr'] 
    }

    this._chain = this._chain
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

    return this.db.find(this._find)
      .then(results => {
        this._docs.push(...results.docs) // this._chain is tied to this._docs 
        return this._chain.value() // execute the chain
      }).catch(err => console.log('err', err))
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

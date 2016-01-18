import chrono from 'chrono-node'
import moment from 'moment'
import every from 'lodash/collection/every'
import includes from 'lodash/collection/includes'

export { filterTags }
export { hashTags }
export { parseDateRange }

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

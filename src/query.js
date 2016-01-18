export { filterTags }

import every from 'lodash/collection/every'
import includes from 'lodash/collection/includes'

function filterTags (tags = [], row) {
  if (!tags) // no tags provided, filter nothing
    return true

  const docTags = row.doc.tags || [] 

  const found = every(tags, t => includes(docTags, t))
  return found
}

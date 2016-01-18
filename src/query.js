export { filterTags }
export { hashTags }

import every from 'lodash/collection/every'
import includes from 'lodash/collection/includes'

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

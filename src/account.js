
/* Account login state manager
 */

import _ from 'lodash'
import db from './db'
import { storeKey } from './config'

export default setUser

function setUser(user) {
  storeKey('user', user.id)
  storeKey('remote', user.couch.url)
  const opts = { include_docs: true }
  return db.allDocs(opts)
  .then(rslt => {
    const author = { user: user.id }
    const docs = _.chain(rslt.rows)
      .map('doc')
      .reject(author)
      .map(e => _.merge(e, author))
      .value()
    return db.bulkDocs(docs)
  })
}

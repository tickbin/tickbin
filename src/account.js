
/* Account login state manager
 */

import { storeKey } from './config'

export default { set }

function set(user) {
  storeKey('remote', user.couch.url)
  storeKey('user', user.id)
  return user
}

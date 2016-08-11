import { removeKey } from '../config'
import conf from '../config'
import url from 'url'

export default { builder, handler : logout}

function builder(yargs) {
  return yargs
  .usage('Usage: tick logout')
}

function logout(argv) {
  const parsedUrl = url.parse(conf.remote)
  if (parsedUrl.hostname === 'couch.tickbin.com'){
    console.log('You have been logged out')
    removeKey('user')
    removeKey('remote')
  } else {
    console.log('You are not logged into Tickbin')
  }
}
import { removeKey } from '../config'

export default { builder, handler : logout}

function builder(yargs) {
  return yargs
  .usage('Usage: tick logout')
}

function logout(argv) {
  console.log('I\'ll log you out')
  removeKey('user')
  removeKey('remote')
}
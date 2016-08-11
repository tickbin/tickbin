import chalk from 'chalk'
import prompt from 'prompt'
import server from '../server'
import setUser from '../account'
import conf from '../config'
import url from 'url'

export default { builder, handler : login }

function builder(yargs) {
  return yargs
  .usage('Usage: tick login')
}

function login(argv) {
  const parsedUrl = url.parse(conf.remote)
  if (parsedUrl.hostname === 'couch.tickbin.com') {
    return console.log('You are already logged in, type tick logout to logout')
  } else if (parsedUrl.hostname) {
    return console.log('You already have a custom remote set.')
  }

  let values = [
    { name : 'username' },
    { name : 'password', hidden : true }
  ]

  prompt.message = ''
  prompt.delimiter = ''
  prompt.start()

  prompt.get(values, (err, user) => {
    if (err && err.message === 'canceled')
      return console.log('\nCanceled login.')

    if (err) 
      throw err
 
    server.login(user)
    .then(user => setUser(user))
    .then(() => console.log('You\'re logged in now'))
    .catch(err => console.error(formatError(err)))
  })

}

function formatError(err) {
  const prefix = chalk.bgRed('Error')
  const message = err.data || err.message
  return prefix + ' ' + message
}

import chalk from 'chalk'
import prompt from 'prompt'
import server from '../server'
import setUser from '../account'
import conf from '../config'
import url from 'url'

export default { builder, handler : register }

function builder(yargs) {
  return yargs
  .usage('Usage: tick register')
}

function register(yargs) {
  const parsedUrl = url.parse(conf.remote)
  if (parsedUrl.hostname === 'couch.tickbin.com'){
    return console.log('You are already logged in, type tick logout to logout')
  } else if (parsedUrl.hostname) {
    return console.log('You already have a custom remote set.')
  }

  let values = [
    { name : 'betaKey' },
    { name : 'username' },
    { name : 'email' },
    { name : 'password', hidden : true }
  ]

  prompt.message = 'Registration currently requires'
  + ' a beta key while we are in testing. Sign up for'
  + ' the waiting list at https://tickbin.com\n'
  prompt.delimiter = ''
  prompt.start()

  prompt.get(values, (err, user) => {
    if (err && err.message === 'canceled')
      return console.log('\nNo? Ok, no hard feelings.') 

    if (err)
      throw err
    
    server.register(user)
    .then(user => setUser(user))
    .then(() => console.log(chalk.bgGreen('Account created')))
    .catch(err => console.error(formatError(err)))
  })
}

function formatError(err) {
  const prefix = chalk.bgRed('Error')
  const message = err.data || err.message
  const isArray = message instanceof Array
  if (isArray) return prefix + ' ' + message.join('\n')
  else return prefix + ' ' + message
}

import chalk from 'chalk'
import prompt from 'prompt'
import server from '../server'
import setUser from '../account'

export default { builder, handler : register }

function builder(yargs) {
  return yargs
  .usage('Usage: tick register')
}

function register(yargs) {
  let values = [
    { name : 'username' },
    { name : 'email' },
    { name : 'password', hidden : true },
    { name : 'betaKey' }
  ]

  prompt.message = 'Registration currently requires a beta key while we are in testing. Sign up for the waiting list at https://tickbin.com\n'
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

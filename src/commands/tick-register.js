import chalk from 'chalk'
import prompt from 'prompt'
import config from '../config'
import server from '../server'
import { setConfig } from '../config'

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

  prompt.message = ''
  prompt.delimiter = ''
  prompt.start()

  prompt.get(values, (err, user) => {
    if (err) throw err
    server.register(user)
    .then(user => setConfig('remote', user.couch.url))
    .then(() => console.log(chalk.bgGreen('Account created')))
    .catch(handleError)
  })
}

function handleError(err) {
  let message = err.data
  if (message instanceof Array) {
    message = message.join('\n')
  } 
  console.error(chalk.bgRed('Error'), message)
}

export default { builder, handler : register }

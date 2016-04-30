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

  prompt.message = ''
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

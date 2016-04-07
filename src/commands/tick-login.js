import chalk from 'chalk'
import prompt from 'prompt'
import config from '../config'
import server from '../server'
import { setConfig } from '../config'

export default { builder, handler : login }

function builder(yargs) {
  return yargs
  .usage('Usage: tick login')
}

function login(argv) {
  let values = [
    { name : 'username' },
    { name : 'password', hidden : true }
  ]

  prompt.message = ''
  prompt.delimiter = ''
  prompt.start()

  prompt.get(values, (err, user) => {
    if (err) throw err
    server.login(user)
    .then(user => setConfig('remote', user.couch.url))
    .then(() => console.log('You\'re logged in now'))
    .catch(err => console.error(chalk.bgRed('Error'), err.data))
  })

}

export default register

import chalk from 'chalk'
import prompt from 'prompt'
import config from '../config'
import server from '../server'
import { setConfig } from '../config'

function register (yargs) {
  let argv = yargs
  .usage('Usage: tick register')
  .help('h')
  .alias('h', 'help')
  .argv

  let values = [
    { name : 'username' },
    { name : 'password', hidden : true }
  ]

  prompt.message = ''
  prompt.delimiter = ''
  prompt.start()

  prompt.get(values, (err, user) => {
    if (err) throw err
    server.register(user)
    .then(user => setConfig('remote', user.couch.url))
    .then(() => console.log(chalk.bgGreen('Account created')))
    .catch(err => console.error(chalk.bgRed('Error'), err.data))
  })

}

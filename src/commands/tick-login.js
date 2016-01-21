export default login

import fs from 'fs'
import ini from 'ini'
import chalk from 'chalk'
import prompt from 'prompt'
import untildify from 'untildify'
import config from '../config'
import server from '../server'

function login (yargs) {
  let argv = yargs
  .usage('Usage: tick register')
  .help('h')
  .alias('h', 'help')
  .argv

  prompt.message = ''
  prompt.delimiter = ''
  prompt.start()

  let values = [ 'username', 'password' ]
  prompt.get(values, (err, user) => {
    if (err) throw err
    server.login(user)
    .then(user => updateConfig(user.couch.url))
    .then(() => console.log('You\'re logged now'))
    .catch(err => console.error(err.statusText))
  })

}

function updateConfig (url) {
  let parsed = {}
  let target = config.config || untildify('~/.tickbinrc')
  if (config.config) parsed = ini.parse(fs.readFileSync(target, 'utf-8'))
  if (parsed.remote) throw new Error('You already are registered')
  else parsed.remote = url
  let s = ini.stringify(parsed)
  fs.writeFileSync(target, s)
}

export default register

import fs from 'fs'
import ini from 'ini'
import chalk from 'chalk'
import prompt from 'prompt'
import request from 'superagent'
import untildify from 'untildify'
import config from '../config'

const server = 'http://localhost:8080/'

function register (yargs) {
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
    request
    .post(server + 'user')
    .send(user)
    .end((err, res) => {
      if (err) throw err
      updateConfig(res.body.couch.url)
      console.log(chalk.bgGreen('Account Created'))
    })
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

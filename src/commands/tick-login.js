export default login

import fs from 'fs'
import ini from 'ini'
import chalk from 'chalk'
import prompt from 'prompt'
import request from 'superagent'
import untildify from 'untildify'
import config from '../config'

const server = 'http://localhost:8080/'

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
    request
    .post(server + 'token')
    .send(user)
    .end((err, res) => {
      if (err) throw err
      let token = res.body.token
      request
      .get(server + 'user')
      .use(request => request.set('Authorization', 'Bearer ' + res.body.token))
      .end((err, res) => {
        updateConfig(res.body.couch.url)
        console.log('You\'re logged in now')
      })
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

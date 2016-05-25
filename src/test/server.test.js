import test from 'tape'
import nock from 'nock'
import server from '../server'
import config from '../config'

test('logging into the server', t => {

  t.plan(3)

  let username = 'chrisfosterelli'
  let password = 'password'
  let token = '[....]'

  let couch = { 
    name : username,
    password : 'a_random_password',
    url : 'http://[....]'
  }

  let n = nock(config.api)
  .post('/token', { username, password })
  .reply(200, { token })
  .get('/user/self')
  .reply(200, { username, password, couch })

  let p = server.login({ username, password })
  t.equal(typeof p.then, 'function', 'returns a promise')

  p.then(user => {
    t.ok(n.isDone(), 'performs request for token and user')
    t.deepEqual(user, { username, password, couch }, 'returns the user')
  })

})

test('registering with the server', t => {

  t.plan(3)

  let username = 'chrisfosterelli'
  let password = 'password'
  let email    = 'chrisfosterelli@nomail.com'
  let betaKey  = 'beta'

  let couch = { 
    name : username,
    password : 'a_random_password',
    url : 'http://[....]'
  }

  let n = nock(config.api)
  .post('/user', { username, password, email, betaKey })
  .reply(200, { username, password, couch })

  let p = server.register({ username, password, email, betaKey })
  t.equal(typeof p.then, 'function', 'returns a promise')

  p.then(user => {
    t.ok(n.isDone(), 'performs request for user')
    t.deepEqual(user, { username, password, couch }, 'returns the user')
  })

})

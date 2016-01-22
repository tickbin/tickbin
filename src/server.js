
/* API wrapper to tickbin server
 */

import axios from 'axios'
import config from './config'

const server = config.api

function login(user) {
  return axios
  .post(server + 'token', user)
  .then(res => {
    let token = 'Bearer ' + res.data.token
    let headers = { Authorization : token }
    let options = { headers }
    return axios
    .get(server + 'user', options)
    .then(res => res.data)
  })
}

function register(user) {
  return axios
  .post(server + 'user', user)
  .then(res => res.data)
}

export default { register, login }

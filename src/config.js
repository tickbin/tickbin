import fs from 'fs'
import rc from 'rc'
import ini from 'ini'
import path from 'path'
import mkdirp from 'mkdirp'
import untildify from 'untildify'

const conf = rc('tickbin', {
  api: 'https://api.tickbin.com/',
  local: '~/.tickbin'
})

conf.local = untildify(conf.local)
conf.db = path.join(conf.local, 'data')

if (!fs.existsSync(conf.local)) {
  mkdirp.sync(conf.local)
}

function setConfig(key, value) {
  let parsed = {}
  let target = conf.config || untildify('~/.tickbinrc')
  if (conf.config) parsed = ini.parse(fs.readFileSync(target, 'utf-8'))
  parsed[key] = value
  fs.writeFileSync(target, ini.stringify(parsed))
}

export { setConfig }
export default conf

import rc from 'rc'
import path from 'path'
import fs from 'fs'
import mkdirp from 'mkdirp'
import untildify from 'untildify'

const conf = rc('tickbin', {
  local: '~/.tickbin/data'
})

conf.local = untildify(conf.local)
conf.db = path.join(conf.local, 'data')

if (!fs.existsSync(conf.local)) {
  mkdirp.sync(conf.local)
}

export default conf

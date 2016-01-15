import rc from 'rc'
import path from 'path'
import fs from 'fs'
import mkdirp from 'mkdirp'
import untildify from 'untildify'

const conf = rc('tickbin', {
  tickDir: '~/.tickbin/data'
})

conf.tickDir = untildify(conf.tickDir)
conf.db = path.join(conf.tickDir, 'data')

if (!fs.existsSync(conf.tickDir)) {
  mkdirp.sync(conf.tickDir)
}

export default conf

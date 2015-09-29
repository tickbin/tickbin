import rc from 'rc'
import path from 'path'
import fs from 'fs'

const tickDir = path.join(process.env.HOME, '.tickbin')

if (!fs.existsSync(tickDir)) {
  fs.mkdirSync(tickDir)
}

const conf = rc('tickbin', {
  db: path.join(tickDir,'data')
})

export default conf

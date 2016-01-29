export default sync

import db from '../db'
import conf from '../config'
import TickSyncer from '../sync'

function sync(yargs) {
  let argv = yargs
  .usage('Usage: tick sync')
  .help('h')
  .alias('h', 'help')
  .argv


  if (!conf.remote) return console.log('No remote specified in config')

  const tickSync = new TickSyncer(db, conf.remote)

  tickSync.sync().then(showSync, handleErr)
}

function handleErr(err) {
  let msg = 'Could not sync with remote CouchDB:'
  console.error(chalk.bgRed('error'), msg, err.message)
}

function showSync(info) {
  console.log(`Push: ${info.push.docs_written}  Pull: ${info.pull.docs_written}`)
}

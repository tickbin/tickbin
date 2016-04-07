import db from '../db'
import conf from '../config'
import dbsync from '../sync'

export default { builder, handler : sync }

function builder(yargs) {
  return yargs
  .usage('Usage: tick sync')
}

function sync(argv) {
  if (!conf.remote) return console.log('No remote specified in config')

  const evt = dbsync(db, conf.remote)
  evt.on('error', handleErr)
  evt.on('denied', handleErr)
  evt.on('complete', showSync)
}

function handleErr(err) {
  let msg = 'Could not sync with remote CouchDB:'
  console.error(chalk.bgRed('error'), msg, err.message)
}

function showSync(info) {
  console.log(`Push: ${info.push.docs_written}  Pull: ${info.pull.docs_written}`)
}

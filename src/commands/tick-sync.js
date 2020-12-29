import db from '../db'
import conf from '../config'
import dbsync from '../sync'
import chalk from 'chalk'
import ora from 'ora'

export default { builder, handler : sync }

const spinner = ora('Syncing')

function builder(yargs) {
  return yargs
  .usage('Usage: tick sync')
}

function sync(argv) {
  if (!conf.remote) return console.log('No remote specified in config')

  spinner.start()
  const evt = dbsync(db, conf.remote)
  evt.on('error', handleErr)
  evt.on('denied', handleErr)
  evt.on('complete', showSync)
  evt.on('change', handleChange)
}

function handleErr(err) {
  let msg = 'Could not sync with remote CouchDB:'
  spinner.fail(
    `${chalk.bgRed('error')} ${msg} ${err.doc.id} ${err.doc.message} ${err.doc.reason}`
  )
}

function showSync(info) {
  spinner.succeed(`Push: ${info.push.docs_written}  Pull: ${info.pull.docs_written}`)
}

function handleChange(info) {
  if (info.change.pending === undefined) return
  const totalDocs = info.change.pending + info.change.docs_read
  const elapsed = parseInt(info.change.docs_read)
  const percentage = Math.round(elapsed / totalDocs * 100)
  spinner.text = `${percentage}% Synced ${chalk.yellow('›')} ${elapsed}/${totalDocs}`
}
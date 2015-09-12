#!/usr/bin/env babel-node

import yargs from 'yargs'

export default log

function log (yargs) {
  let argv = yargs
  .option('date', {
    alias: 'd',
    describe: 'date for tick',
    demand: true
  })
  .help('h')
  .alias('h', 'help')
  .argv

}

#!/usr/bin/env babel-node

import yargs from 'yargs'
import log   from './commands/tick-log'
import list  from './commands/tick-list'

let master = yargs
.usage('tick <command>')
.command('log', 'log a tick')
.command('list', 'list your ticks')
.help('h')
.alias('h', 'help')
.demand(1, 'you must provide a valid command')

let argv = master.argv
let command = argv._[0]

if (command === 'log') {
  console.log('DEBUG: log')
  log(master.reset())
}

if (command === 'list') {
  console.log('DEBUG: list')
  list(master.reset())
}

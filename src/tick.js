#!/usr/bin/env node

import yargs    from 'yargs'
import log      from './commands/tick-log'
import login    from './commands/tick-login'
import list     from './commands/tick-list'
import register from './commands/tick-register'
import rm       from './commands/tick-rm'
import upgrade  from './commands/tick-upgrade'
import sync     from './commands/tick-sync'

yargs
.usage('Usage: tick <command> [options]')
.command('log', 'log a tick', log)
.command('login', 'login to your account', login)
.command('list', 'list your ticks', list)
.command('register', 'create an account', register)
.command('rm', 'delete a tick', rm)
.command('upgrade', 'upgrade your tickbin', upgrade)
.command('sync', 'sync your database with remotes', sync)
.check(checkCommand)
.alias('h', 'help')
.help('h')
.argv

function checkCommand (argv) {
  const validArgs = [ 'log', 'list', 'rm' ]
  if (validArgs.indexOf(argv._[0]) == -1) {
    throw new Error('you must provide a valid command')
  }
}

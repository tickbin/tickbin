#!/usr/bin/env node

import yargs    from 'yargs'
import manifest from '../package.json'
import commit   from './commands/tick-commit'
import login    from './commands/tick-login'
import log      from './commands/tick-log'
import register from './commands/tick-register'
import rm       from './commands/tick-rm'
import upgrade  from './commands/tick-upgrade'
import sync     from './commands/tick-sync'

yargs
.usage('Usage: tick <command> [options]')
.command('commit', 'commit a tick', commit)
.command('login', 'login to your account', login)
.command('log', 'display a log of your ticks', log)
.command('register', 'create an account', register)
.command('rm', 'delete a tick', rm)
.command('upgrade', 'upgrade your tickbin', upgrade)
.command('sync', 'sync your database with remotes', sync)
.version(manifest.version, 'version', 'prints the current version of tickbin')
.demand(1)
.check(checkCommand)
.alias('h', 'help')
.help('h')
.argv

function checkCommand () {
  // Only executed when no other commands are matched,
  // and `demand(1)` are satisfied.
  // Therefore, when executed, an invalid command was provided
  throw new Error('An invalid command was provided')
}

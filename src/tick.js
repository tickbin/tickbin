#!/usr/bin/env node

import yargs    from 'yargs'
import manifest from '../package.json'
import commit   from './commands/tick-commit'
import login    from './commands/tick-login'
import logout   from './commands/tick-logout'
import log      from './commands/tick-log'
import register from './commands/tick-register'
import rm       from './commands/tick-rm'
import upgrade  from './commands/tick-upgrade'
import sync     from './commands/tick-sync'

yargs
.usage('Usage: tick <command> [options]')
.command('commit', 'commit a tick', commit)
.command('login', 'login to your account', login)
.command('logout', 'logout of your account', logout)
.command('log', 'display a log of your ticks', log)
.command('register', 'create an account', register)
.command('rm', 'delete a tick', rm)
.command('upgrade', 'upgrade your tickbin', upgrade)
.command('sync', 'sync your database with remotes', sync)
.version('version', 'prints the current version of tickbin', manifest.version)
.demand(1)
.strict()
.alias('h', 'help')
.help()
.argv

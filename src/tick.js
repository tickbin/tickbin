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
import start    from './commands/tick-start'
import stop     from './commands/tick-stop'
import cancelTimer from './commands/tick-cancel-timer'

yargs
.usage('Usage: tick <command> [options]')
.command('commit', 'commit a tick', commit)
.command('login', 'login to your account', login)
.command('log', 'display a log of your ticks', log)
.command('register', 'create an account', register)
.command('rm', 'delete a tick', rm)
.command('upgrade', 'upgrade your tickbin', upgrade)
.command('sync', 'sync your database with remotes', sync)
.command('start', 'start a timer', start)
.command('stop', 'stop a timer and commit entry', stop)
.command('cancel-timer', 'cancel a timer', cancelTimer)
.version('version', 'prints the current version of tickbin', manifest.version)
.demand(1)
.strict()
.alias('h', 'help')
.help()
.argv

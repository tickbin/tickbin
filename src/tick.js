
import yargs   from 'yargs'
import log     from './commands/tick-log'
import list    from './commands/tick-list'
import rm      from './commands/tick-rm'
import upgrade from './commands/tick-upgrade'

yargs
.usage('Usage: tick <command> [options]')
.command('log', 'log a tick', log)
.command('list', 'list your ticks', list)
.command('rm', 'delete a tick', rm)
.command('upgrade', 'upgrade your tickbin', upgrade)
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

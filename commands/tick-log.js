export default log

function log (yargs) {
  let argv = yargs
  .usage('tick log')
  .option('date', {
    alias: 'd',
    describe: 'date for tick',
    demand: true
  })
  .help('h')
  .alias('h', 'help')
  .argv
}

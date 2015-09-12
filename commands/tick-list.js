export default list

function list (yargs) {
  let argv = yargs
  .usage('tick list')
  .help('h')
  .alias('h', 'help')
  .argv
}

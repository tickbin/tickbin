export default { builder, handler : stop}

function builder(yargs) {
  return yargs
  .usage('Usage: tick stop')
}

function stop(argv) {
  console.log('Your timer has been stopped')
}
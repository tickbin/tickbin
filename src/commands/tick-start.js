export default { builder, handler : start}

function builder(yargs) {
  return yargs
  .usage('Usage: tick start')
}

function start(argv) {
  console.log('Starting a timer')
}
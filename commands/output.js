export {write as write}

function write(entry) {
  console.log(`${entry._id} ${entry.startDate} ${entry.message}`)
}

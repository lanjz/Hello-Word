
function log(...info){
  console.log('\x1B[36m%s\x1B[0m', ...info)
}
function err(info){
  console.log('\x1B[31m%s\x1B[0m', info)
}
module.exports = {
  log,
  err
}
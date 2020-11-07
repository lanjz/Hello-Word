const fs = require('fs')
fs.readFile('./txt.txt', function (err, body) {
  console.log(body)
  console.log(body.toString())
})
const { Writable } = require('stream');
let num = 0
const outStream = new Writable({
  write(chunk, encoding, callback) {
    console.log(num++ + ':' +chunk.toString());
    callback();
  }
});

process.stdin.pipe(outStream);
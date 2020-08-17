const fork = require('child_process').fork;
return
const server = require('net').createServer();
server.listen(3000);
const worker = fork('worker.js');

worker.send('server', server);
console.log('worker process created, pid: %s ppid: %s', worker.pid, process.pid);
// process.exit(0); // 创建子进程之后，主进程退出，此时创建的 worker 进程会成为孤儿进程
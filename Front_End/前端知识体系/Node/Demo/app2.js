const http = require('http');
const mod = require('./mod.js')
console.log('mod', mod)
const longComputation = () => {
    return new Promise(resolve => {
        let sum = 0;
        for (let i = 0; i < 1e10; i++) {
            sum += i;
        };
        resolve(sum)
    })
};
const server = http.createServer();
server.on('request', async (req, res) => {
    if (req.url === '/compute') {
        console.info('计算开始',new Date());
        longComputation()
            .then(sum => {
                console.info('计算结束',new Date());
                res.end(`Sum is ${sum}`);
            })
        // return res.end(`Sum is ${sum}`);
    } else {
        console.info('计算开始2',new Date());
        longComputation()
            .then(sum => {
                console.info('计算结束2',new Date());
                res.end(`Sum is ${sum}`);
            })
    }
});

server.listen(3003);

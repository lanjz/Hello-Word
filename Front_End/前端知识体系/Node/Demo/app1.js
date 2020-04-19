const fs = require('fs')
const Koa = require('koa')
const app = new Koa()

app.use(ctx => {
    fs.readFile('some.txt', function(err, data){
        if (err) throw err
        console.log(data)
        ctx.body = 'Hello Kos'
    })
})
// process.on('uncaughtException', function(err){
    // console.log('err')
// })
app.listen(3000)
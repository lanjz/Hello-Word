const Koa=require('koa');
const router = require('koa-router')();  /*引入是实例化路由** 推荐*/
var WebSocket = require('ws');

const app=new Koa();
app.use(require('koa-static')(__dirname, 'www'))

var wss = new WebSocket.Server({ port: 3001 });
let sock = null
wss.on('connection', function(ws) {
    sock = ws
    console.log('server: 收到连接');
    ws.on('message', function(message) {
        console.log('server: 收到消息', message);
    });
});

router.get('/',async (ctx)=>{
    let req_query = ctx.request.query
    console.log('req_query', req_query.name)
    if(sock) {
        sock.send(req_query.name);
    }
    ctx.body= req_query.name || "首页";
})

app.use(router.routes());   /*启动路由*/
app.use(router.allowedMethods());

app.listen(3000);

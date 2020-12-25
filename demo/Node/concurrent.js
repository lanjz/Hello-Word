const Koa = require('koa')
const app = new Koa()
const Router = require('@koa/router');
const { delay, fibonacci } = require('./helper')

function timeLog(start, end = new Date()){
    return `开始处理时间：${start};结束时间：${end};处理时长：${end - start}`
}

const router = new Router();
router.get('/delay', async (ctx, next) => {
    const start = new Date()
    await delay(6)
    ctx.body = timeLog(start)
  });
router.get('/fibonacci', async (ctx, next) => {
    const start = new Date()
    fibonacci(45)
    ctx.body = timeLog(start)
});
router.get('/', async (ctx, next) => {
    const start = new Date()
    ctx.body = timeLog(start)
  });
  
  app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000, () => {
    console.log('去吧 皮卡丘：3000')
})
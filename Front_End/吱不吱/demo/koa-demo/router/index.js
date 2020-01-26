const Router = require('koa-router');
const md5 = require('md5-nodejs');
const router = new Router()

const data = {
  data: 'koa-demo2'
}
router.get('/', async (ctx, next) => {
  let title = 'hello koa22'
  await ctx.render('index', {
    title,
  })
})
router.get('/data', (ctx, next) => {
  const hash = md5(data);
  const ifNoneMatch = ctx.get("If-None-Match")
  console.log('ifNoneMatch', ifNoneMatch)
  if (ifNoneMatch && ifNoneMatch === hash) {
    ctx.status = 304
    return
  }
  ctx.set('Etag', hash)
  ctx.set('Cache-Contrl', 'no-store')
  ctx.set("Content-Type", "application/json")
  ctx.body = JSON.stringify(data)
})


module.exports = router
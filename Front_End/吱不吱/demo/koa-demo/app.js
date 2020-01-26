const Koa = require('koa');
const app = new Koa();
const views = require('koa-views')
const path = require('path')
const router  = require('./router/index')
const resource = require('koa-static');

app.use(views(path.join(__dirname, './view'), {
  extension: 'ejs'
}))

app.use(async (ctx, next) => {
  // 设置响应头Cache-Control 设置资源有效期为30秒
 ctx.set({
    'Cache-Control': 'max-age=30'
  });
  // ctx.set('Expires', new Date(Date.now() + 30 * 1000).toUTCString())

  await next();
});
app.use(resource(path.join(__dirname, './img')));


app
  .use(router.routes())
  .use(router.allowedMethods());
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
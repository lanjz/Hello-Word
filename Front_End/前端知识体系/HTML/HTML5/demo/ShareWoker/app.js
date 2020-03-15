const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(__dirname, 'demo'))

app.use(async ctx => {
    ctx.body = 'Hello World';
});


app.listen(3000, () => {console.log('seccess')});

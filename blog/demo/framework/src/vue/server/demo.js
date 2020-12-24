const path = require('path')
const Vue = require('vue')
const server = require('express')()

const renderer = require('vue-server-renderer').createRenderer({
  template: require('fs').readFileSync(path.resolve(__dirname, './index.template.html'), 'utf-8')
})
const context = {
  title: 'hellohello',
  meta: '<meta charset="utf-8">'
}
server.get('*', (req, res) => {
  const app = new Vue({
    data: {
      url: req.url
    },
    template: `<div>访问的 URL 是： {{ url }}</div>`
  })

  renderer.renderToString(app, context, (err, html) => {
    console.log('html', html)
    if (err) {
      res.status(500).end('Internal Server Error')
      return
    }
    res.end(html)
  })
})

server.listen(8080, ()=> {
  console.log('启动啦啦啦啦啦啦啦')
})
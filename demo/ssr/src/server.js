const path = require('path')
const server = require('express')()
const { createBundleRenderer } = require('vue-server-renderer')
// server.js
// const createApp = require('/path/to/built-server-bundle.js')
const serverBundle = require('../dist/vue-ssr-server-bundle.json')
const clientManifest = require('../dist/vue-ssr-client-manifest.json')
const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false, // 推荐
  clientManifest, // （可选）客户端构f建 manifest
  template: require('fs').readFileSync(path.resolve(__dirname, './index.template.html'), 'utf-8')
})
const context = {
  title: 'hellohello',
  meta: '<meta charset="utf-8">'
}
server.get('*', (req, res) => {
  // const app = createApp()

  renderer.renderToString(context, (err, html) => {
    if (err) {
      console.log('eerr', err)
      res.status(500).end('Internal Server Error')
      return
    }
    res.end(html)
  })
})

server.listen(8080, ()=> {
  console.log('启动啦啦啦啦啦啦啦')
})
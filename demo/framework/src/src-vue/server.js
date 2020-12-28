const path = require('path')
const fs = require('fs')
const express = require('express')
const LRU = require('lru-cache')
const app = express()
const { createBundleRenderer } = require('vue-server-renderer')
const isProd = process.env.NODE_ENV === 'production'
function createRenderer (bundle, options) {
  return createBundleRenderer(bundle, Object.assign(options, {
    // for component caching
    cache: LRU({
      max: 1000,
      maxAge: 1000 * 60 * 15
    }),
    // this is only needed when vue-server-renderer is npm-linked todo
    basedir: path.resolve('./dist'),
    // recommended for performance
    runInNewContext: false
  }))
}
app.use(express.static('./dist'))
const templatePath = path.resolve(__dirname, './server/index.template.html')
let renderer
let readyPromise
if (isProd) {
  // In production: create server renderer using template and built server bundle.
  // The server bundle is generated by vue-ssr-webpack-plugin.
  const template = fs.readFileSync(templatePath, 'utf-8')
  const serverBundle = require('../../../dist/vue-ssr-server-bundle.json')
  // The client manifests are optional, but it allows the renderer
  // to automatically infer preload/prefetch links and directly add <script>
  // tags for any async chunks used during render, avoiding waterfall requests.
  const clientManifest = require('../../../dist/vue-ssr-client-manifest.json')
  renderer = createRenderer(serverBundle, {
    template,
    clientManifest
  })
} else {
  // In development: setup the dev server with watch and hot-reload,
  // and create a new renderer on bundle / index template update.
  readyPromise = require('./server/setup-dev-server')(
    app,
    templatePath,
    (bundle, options) => {
      renderer = createRenderer(bundle, options)
      console.log('renderer-----------------', renderer)
    }
  )
}

function render(req, res){
  const s = Date.now()
  const handleError = err => {
    if (err.url) {
      res.redirect(err.url)
    } else if(err.code === 404) {
      res.status(404).send('404 | Page Not Found')
    } else {
      // Render Error Page or Redirect
      res.status(500).send('500 | Internal Server Error')
      console.error(`error during render : ${req.url}`)
      console.error(err.stack)
    }
  }
  const context = {
    title: 'hellohello',
    meta: '<meta charset="utf-8">',
    url: req.url
  }
  console.log('renderer.renderToString', renderer)
  renderer.renderToString(context, (err, html) => {
    if (err) {
      return handleError(err)
    }
    res.end(html)
    if (!isProd) {
      console.log(`whole request: ${Date.now() - s}ms`)
    }
  })
}
console.log('isProd', isProd)
app.get('*', isProd ? render : (req, res) => {
  readyPromise.then(() => {
    console.log('readyPromisereadyPromisereadyPromise')
    return render(req, res)
  })
})

const port =process.env.PORT || 8088
app.listen(port, ()=> {
  console.log('启动啦啦啦啦啦啦啦', port)
})
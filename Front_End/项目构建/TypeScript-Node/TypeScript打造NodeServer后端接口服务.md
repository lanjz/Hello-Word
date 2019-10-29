> https://www.jianshu.com/p/1a91f36e5153

初始化项目：`npm init`

安装依赖

  - `yarn add typescript @types/koa ts-node -D`
  
  - `yarn add koa`

新建文件：`tsconfig.json`文件

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es2017",
    "noImplicitAny": true,
    "moduleResolution": "node",
    "sourceMap": true,
    "outDir": "dist",  // TS文件编译后会放入到此文件夹内
    "baseUrl": ".",
    "paths": {
      "*": [
        "node_modules/*",
        "src/types/*"
      ]
    }
  },
  "include": [
    "src/**/*"
  ]
}

```

启动文件`src/server.ts`

```javascript
const app = require('./app');

const server = app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
    console.log('Press CTRL-C to stop \n');
});

module.exports = server;

```

启动文件`src/app.ts`

```javascript
import * as Koa from 'koa';

const app = new Koa();

app.use(ctx => {
    ctx.body = 'Hello world232';
});

module.exports = app;

```

## 实现热更新

`yarn add nodemon`

添加启动脚本命令

```JSON
  "watch": "nodemon --watch src/* -e ts,tsx --exec ts-node ./src/server.ts",
```

`nodemon`来监控文件的改变， 使用ts-node（类似，执行了 tsc && node dist/server.js）启动项目

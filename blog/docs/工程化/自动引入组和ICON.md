---
sidebar: auto
---

# 自动引入组件和ICON

当前配置例子以 Vue3(webpack) 为例

## 自动引入icon 

自动引入收录到 [iconify](https://icon-sets.iconify.design/) 中的图标

### 首页 Webpack 配置

```js
const { defineConfig } = require('@vue/cli-service')
const Icons = require('unplugin-icons/webpack')
const IconsResolver = require('unplugin-icons/resolver')
const Components = require('unplugin-vue-components/webpack')
module.exports = defineConfig({

  configureWebpack: {
    plugins: [
      Components({
        resolvers: [
          // 自动注册图标组件
          IconsResolver({
            // 使用element-plus的图标库
            // 其他图标库请到 https://icon-sets.iconify.design/
            enabledCollections: ['ep', 'carbon'],
            prefix: 'icon',
          }),
        ],
      }),
      Icons({
        autoInstall: true,
        compiler: 'vue3'
      }),
    ]
  },

})

```

### 查找图标

前往 [iconify](https://icon-sets.iconify.design/) 查找图片

假如我想用这个 `Material Symbols` 里的图标

![](./static/auto-icon-1.png)

然后随便选一个图片，底部会出现图标信息

![](./static/auto-icon-2.png)

注意这个图片的名称为 `material-symbols:14mp-rounded`，冒号前表前的图标集，冒号后表示图标名，这个图标信名称是需要配置到 Webpack 中的，如下：

```js
 resolvers: [
    // 自动注册图标组件
    IconsResolver({
      // 使用element-plus的图标库
      // 其他图标库请到 https://icon-sets.iconify.design/
      enabledCollections: ['ep', 'carbon', 'material-symbols'], // 添加 material-symbols
      prefix: 'icon',
    }),
  ],
```

### 使用图标

然后就可以在项目中使用的，使用的规则为：[prefix]-图标集名称-图标名. 如要使用上面图标时代码就写为： `icon-material-symbols-14mp-rounded`

```vue
  <icon-material-symbols-14mp-rounded></icon-material-symbols-14mp-rounded>
```



## 自动化引入 Vue 常用的 api

```js
const path = require('path')
const { defineConfig } = require('@vue/cli-service')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver }  = require('unplugin-vue-components/resolvers')
const pathSrc = path.resolve(__dirname, 'src')

module.exports = defineConfig({
  configureWebpack: {
    plugins: [
      AutoImport({
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ['vue'],
        // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
        resolvers: [
          ElementPlusResolver(),
        ],
        dts: path.resolve(pathSrc, 'auto-imports.d.ts'),
        // eslint报错解决
        eslintrc: {
          enabled: true, // Default `false`
          // filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
          // globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        },
      }),
      Components({
        resolvers: [
          // 自动导入 Element Plus 组件
          ElementPlusResolver(),
        ],
      }),
    ]
  },

})

```

### TS 类型处理

上面配置，项目运行后将在 src 目录下生成一个 `auto-imports.d.ts` 文件，将这个文件配置到 `tsconfig.json` 的 `exclude`

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "strict": true,
    "jsx": "preserve",
    "moduleResolution": "node",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "useDefineForClassFields": true,
    "sourceMap": true,
    "baseUrl": ".",
    "types": [
      "webpack-env"
    ],
    "paths": {
      "@/*": [
        "src/*"
      ]
    },
    "lib": [
      "esnext",
      "dom",
      "dom.iterable",
      "scripthost"
    ]
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "tests/**/*.ts",
    "tests/**/*.tsx",
    "./src/auto-imports.d.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}

```

### 处理 eslint 提示

上面有个 `eslintrc` 配置，项目运行后将在目录下自动生成一个 `.eslintrc-auto-import.json` 文件

然后在 `.eslintrc.js` 文件中配置上面成的文件名

```js
// .eslintrc.js
module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '.eslintrc-auto-import.json'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}

```

这样项目就是可以直接 vue 的 api 了
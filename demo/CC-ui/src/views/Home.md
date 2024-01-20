# 开发文档

## 环境

- node 16+

- vite + [lit-element](https://lit.dev/) + vue3 + TS + sass

## 工程目录

- src/wc：开发组件库的目录

- src/wc/var.scss: 主题变量
- 
- src/examples: 示例目录

其它目录不用管，包括路由也是自动注册的

## 运行

- yarn dev: 启动工程

- yarn build: 打包工程，后期可能会用于打包组件使用文档

- yarn lib: 打包组件库（src/wc 里的组件）

## 开发组件步骤

以开发一个 `Button` 组件为例

1. 在 `src/wc` 目录新建文件夹 `button`

2. 新建两个文件 `buton/index.ts` 和 `button/style.scss`

```
├─src
│  └─button
│      └─index.ts
│      └─style.scss
```

```js
// buton/index.ts
import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { litName } from '../../utils/index'
import style from './style.scss?inline'

@customElement(litName('button')) // 注册组件 litName 是添加前缀的，返回结果为 fin-button
export default class Button extends FinInject(LitElement) {
// export default class Button extends LitElement {
  static styles = [
    css`
      ${unsafeCSS(style)}
    `,
  ]
  @property({ type: Boolean }) disabled = false // 接收属性
  constructor() {
    super()
  }
  render() {
    return html`
      <div class="fin-button" ${this.disabled ? 'is-disabled' : ''}>
        <slot />
      </div>
    `
  }
}

```

**`FinInject`相当于 minxin的作用，存放通用的公共的扩展方法、属性**

3. `wc/index.ts` 中引入 Button 组件

```js
import './var.scss'
import Button from './button/index'
export {
	// ..
  Button
}

```

**Button组件已经准备好了，可以使用了**

4. 创建示例页面，在 `examples` 目录下新一个 `button` 目录，并创建 `examples/mete/button/index.vue` 和 `examples/mete/button/readme.md` 

```
├─examples
│  ├─Form
│  │  ├─date-panel
│  │  ├─input
│  │  ├─select
│  │  └─其它组件
│  ├─Lit-Api
│  │  └─ 其它组件
│  └─Meta
│      └─button
│         ├─index.vue
│         └─readme.md
```

`examples` 目录我们给组件做了个分类

```js
<template>
  <div>
    <DemoWrap>
      <fin-button>我是按钮</fin-button>
      <template #config>
        切换配置
      </template>
    </DemoWrap>
    <MdDoc :md="md"></MdDoc>
  </div>
</template>

<script setup lang="ts">
import md from './readme.md?raw'
</script>
<script lang="ts">
export default {
  aliasName: '按钮',
}
</script>

<style scoped></style>
```

5. 在 `examples` 目录添加完文件后，会自动注册路由并添加至菜单，此时已经可以直接访问了

  - aliasName: 组件中 `aliasName` 属性用于定义菜单目录名字

  - readme.md: 组件使用文件，或者记录一些问题啥的

## 主题

`src/wc/var.scss` 

通过 var 变量设置主题 

## todo

- 是否提供更改主色功能？WC是使用 shadow 渲染，如何在引用时改色？
- root变量待研究
- LIB打包：目前只是做了全量打包
- 按需引入？
- icon 解决方案待确定
- 双向绑定
  - 添加指令？  option 模式应该可以解决， setup + ts 不行
  - 添加Loader, 在打包时处理
- 框架适配
  - 示例工程是直接运行在  vue3 环境的，所以 vue3 下就是当前的所见所得
  - 其它为做测试

## 参考

[momentum.design](https://momentum.design/components/combo-box/code)  
[Github](https://github.com/momentum-design/momentum-ui/blob/master/web-components/src/components/input/Input.ts)

[ui5](https://sap.github.io/ui5-webcomponents/playground/?path=/docs/main-select--docs)

[shoelace](https://shoelace.style/components/option)

# 开发文档

## 环境

- node 16+

- vite + [lit-element](https://lit.dev/) + vue3 + TS + sass

## 工程目录

- src/wc：开发组件库的目录
- src/wc/var.scss: 主题变量
- src/examples: 示例目录，创建页面后菜单和路由都会自动生成


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
import { FinInject } from '../../mixins/index.ts'
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

## 注意事项

### 主题

主题通过 var 变量进行控制， var 变量统一放在 `src/wc/var.scss` 文件 

### vue 的双向绑定

vue 的通信不是使用原生事件，所有无法在FIN组件中直接支持，而且双向绑定实质上是框架的差异化机制，跟我们的组件功能并无关系

后期的解决方式：

- 提供自定义的 vue 指令进行支持
- 通过打包工具在打包过程中对FIN组件使用 vue 组件进一步包装

目前统一FIN组件的绑定值与更新事件

1. 使用 `value` 绑定值
2. 使用 `input` 事件传递绑定值

## 组件实现基类

使用 Lit 默认是继承 LitElement 类来实现组件的开发的

但是在开发中我们统一继承自己维护的 FinInject(LitElement)类来做实现组件功能

**FinInject** 是自己维护和预留的一个类，可以理解为minxin的作用，用于存放之后需要规范及复用的功能逻辑，比如

- 事件通知
- 组件与插槽中组件中的通信

## 第一期的目标

表单组件： form、input、select、dat-picker、date-time-picker、radio(可放二期)、Checkbox（可放二期）

- 表单：`fin-form`、 `fin-form-item`
- 文本框、多行文本： `fin-input`
- 下拉选择器：`fin-select`、`fin-option`
- 日期时间选择器：`fin-date-picker`、`fin-date-time-picker`、`fin-date-panel`、`fin-year-panel`、`fin-month-panel`、`fin-time-panel`
- 单选(可放二期)：`fin-radio`
- 多选（(可放二期)：`fin-Checkbox`

基础组件：`fin-popup`、`fin-button`、`fin-icon`

布局组件：栅格、表格(可能不做) 

**为了方便组件迁移到已有项目，组件的属性和事件会尽量按 element-ui 保持一致**x

### fin-form

| 属性            | 说明       | 类型                  | 默认值  |
|---------------|----------|---------------------|------|
| value         | 表单数据对象      |object |      |
| rules       | 表单验证规则     |object  |      |
| inline       | 行内表单模式     |boolean  |  false    |
| label-width       | 标签的长度     |string  |      |
| label-suffix       | 表单域标签的后缀     |string  |      |
| disabled      | 是否禁用该表单内的所有组件     |boolean  |      |


| 事件     | 说明                 | 参数                            |
|--------|--------------------|-------------------------------|
| validate   | 任一表单项被校验后触发               | Function                             |

| select 插槽 | 说明              | 
|-----------|-----------------|
| default   | 自定义默认内容 | 


| 暴露方法  | 说明                  | 参数                    |
|-------|---------------------|-----------------------|
| validate  | 对整个表单的内容进行验证   | Function                     |
| validateField | 验证具体的某个字段 |Function                     |
| clearValidate | 重置该表单项，将其值重置为初始值，并移除校验结果 |Function   |

### fin-form-item

| 属性            | 说明       | 类型                  | 默认值  |
|---------------|----------|---------------------|------|
| prop         | model 的键名      |string |      |
| label       | 标签文本     |string  |      |
| label-width       | 表单验证规则     |object  |      |
| rules       | 标签的长度     |string  |      |


| 事件 | 说明                 | 参数                            |
|----|--------------------|-------------------------------|
| 无  |              |                              |

| select 插槽 | 说明              | 
|-----------|-----------------|
| default   | 表单的内容 | 
| label   | 标签位置显示的内容 | 


| 暴露方法  | 说明                  | 参数                    |
|-------|---------------------|-----------------------|
| validate  | 对整个表单的内容进行验证   | Function                     |
| clearValidate | 移除该表单项的校验结果 |Function   |


### fin-input


| 属性              | 说明                                            | 类型              | 默认值   |
|-----------------|-----------------------------------------------|-----------------|-------|
| value           | input 值                                       | string          |   |
| type            | textarea + 原生属性                               | string          |   |
| placeholder     | 占位提示                                          | string          | text  |
| formatter       | 对输入的value进行过滤，如果是string则为内置的过滤函数              | function、string | null  |
| disabled        | 是否禁用                                          | boolean         | false |
| clearable       | 是否显示清除按钮                                      | boolean         | false |
| show-word-limit | 是否显示统计字数, 只在 type 为 'text' 或 'textarea' 的时候生效 | boolean         | false |
| show-password   | 是否显示切换密码图标                                    | boolean         | false |
| maxlength       | 最大输入长度                                        | string/ number  |  |
| minlength       | 原生属性，最小输入长度                                   | string/ number  |  |
| rows            | 输入框行数，仅 type 为 'textarea' 时有效 （原生属性）          |  number         |  |
| input-style     | input 元素或 textarea 元素的 style                  |     string      |  |
| autocomplete    | 原生 autocomplete 属性                            |  string         | off |
| name            | 等价于原生 input name 属性                           |  string         |  |
| readonly        | 原生  readonly 属性，是否只读                          |  boolean         | false |
| max             | 原生 max 属性，设置最大值                               |           |  |
| min             | 原生 min 属性，设置最小值                               |           |  |
| step            | 原生属性，设置输入字段的合法数字间隔                            |           |  |
| autofocus       | 原生属性，自动获取焦点                                   |     boolean      |  |
| form            | 原生属性                                          |     string      |  |


| 事件     | 说明                  | 参数                    |
|--------|---------------------|-----------------------|
| input  | 在 Input 值改变时触发      | CustomEvent（e.detail） |
| blur   | 失去焦点                | 无                     |
| focus  | 获得焦点                | 无                     |
| change | 当输入框失去焦点或用户按Enter时触发 | CustomEvent（e.detail）   |
| clear | 点击清空按钮时触发                  | 无   |

| 插槽     | 说明                  | 
|--------|---------------------|
| append  | 输入框前置内容      | 
| before   |输入框后置内容        |


| 暴露方法  | 说明           | 参数                    |
|-------|--------------|-----------------------|
| blur  | 使 input 失去焦点 | 无                     |
| focus | 使 input 获取焦点 | 无                     |
| clear | 清除 input 值   | 无   |


### fin-select

| 属性            | 说明       | 类型                  | 默认值  |
|---------------|----------|---------------------|------|
| value         | 选中值      | string、number、array |      |
| options       | 下拉选择     | []{value, label }   |      |
| clearable       | 是否显示清除按钮     | boolean         | false |
| multiple       | 是否多选     | []{value, label }   |      |
| remote-method | 自定义搜索方法  | Function            | null |
| collapse-tags | 多选折叠多余选项 | Bolean              | true |
| disabeld      | 是否禁用     | Bolean              | false |
| placeholder   | 占位符      | string              |      |
| filterable    | 是否可筛选    | Bolean              | false |
| filter-method | 自定义筛选方法  | Bolean              | false |
| autocomplete    | 原生 autocomplete 属性                          |  string         | off |
| name            | 等价于原生 input name 属性                         |  string         |  |


| 事件     | 说明                 | 参数                            |
|--------|--------------------|-------------------------------|
| blur   | 失去焦点               | 无                             |
| focus  | 获得焦点               | 无                             |
| change | 当输入框失去焦点或用户按Enter时触发 | CustomEvent（e.detail）         |
| clear | 点击清空按钮时触发                 | 无                             |
| visible-change | 下拉框出现/隐藏时触发       | CustomEvent（e.detail:boolean） |

| select 插槽 | 说明              | 
|-----------|-----------------|
| default   | fin-option 组件列表 | 


| 暴露方法  | 说明                  | 参数                    |
|-------|---------------------|-----------------------|
| blur  | 使选择器的输入框失去焦点，并隐藏下拉框   | 无                     |
| focus | 使选择器的输入框获取焦点，并打开下拉框 | 无                     |


### fin-option

| 属性    | 说明    | 类型      |
|-------|-------|---------|
| value | 下拉项值  | string、number |
| label | 下拉项名称 | string、number |
| disabeld   | 是否禁用     | Bolean  |

|  插槽 | 说明          | 
|-----|-------------|
| default | option 组件内容 | 

### fin-date-time-picker

时间日期选择器

日期格式：

```
'Y+': 年
'M+': 月份
'W+': 周
'D+': 日（补0）
'd+': 日
'h+': 小时
'H+': 小时
'm+': 分
's+': 秒
'q+': 季度
'S': 毫秒
//  组合以上元素来自定义日期格式
```


| 属性                | 说明                  | 类型                | 默认值      |
|-------------------|---------------------|-------------------|----------|
| value             | 选中值                 | string、number、array |          |
| disabeld          | 是否禁用                | Bolean            | false    |
| clearable         | 是否显示清除按钮            | boolean           | false    |
| placeholder       | 占位内容                | string            |          |
| start-placeholder | 范围选择时开始日期的占位内容      | string            |          |
| end-placeholder   | 范围选择时结束日期的占位内容      | string            |          |
| type              | 显示类型                | 预留这个属性，只做一个类型     |          |
| format            | 显示在输入框中的格式          |                   |          |
| value-format      | input事件传输时的格式       |                   |          |
| range-separator   | 选择范围时的分隔符           |                   |          |
| default-time      | 范围选择时选中日期所使用的当日内具体时刻 |                   |          |
| disabled-date     | 判断该日期是否被禁用的函数       |                   | Date 对象  |

| 事件     | 说明                  | 参数                    |
|--------|---------------------|-----------------------|
| blur   | 失去焦点                | 无                     |
| focus  | 获得焦点                | 无                     |
| change | 用户确认选定的值时触发 | CustomEvent（e.detail）   |
| clear | 点击清空按钮时触发                 | 无                             |
| visible-change | 下拉框出现/隐藏时触发       | CustomEvent（e.detail:boolean） |

| 插槽 | 说明          | 
|---|-------------|
| 无 | | 

| 暴露方法  | 说明                  | 参数                  |
|-------|---------------------|---------------------|
| handleOpen  | 打开日期选择器弹窗   |                     |
| handleClose  | 关闭日期选择器弹窗 |                     |

### fin-date-picker

日期选择器，date-picker与date-time-picker可以通过继承的方法来复用公共部分

| 属性            | 说明            | 类型          | 默认值      |
|---------------|---------------|----------------|----------|
| value         | 选中值           | string、number、array          |          |
| disabeld      | 是否禁用          | Bolean       | false    |
| clearable       | 是否显示清除按钮      | boolean       | false    |
| placeholder   | 占位内容          | string            |          |
| start-placeholder   | 范围选择时开始日期的占位内容 | string         |          |
| end-placeholder   | 范围选择时结束日期的占位内容 | string               |          |
| type   | 显示类型          | year、month、date、dates、datetime、week 、datetimerange 、daterange、monthrange |          |
| format | 显示在输入框中的格式    |           |          |
| range-separator   | 选择范围时的分隔符           |           |          |
| value-format | input事件传输时的格式 |           |          |
| default-time |范围选择时选中日期所使用的当日内具体时刻 |           |          |
| disabled-date | 判断该日期是否被禁用的函数 |           | Date 对象  |

| 事件     | 说明                  | 参数                    |
|--------|---------------------|-----------------------|
| blur   | 失去焦点                | 无                     |
| focus  | 获得焦点                | 无                     |
| change | 用户确认选定的值时触发 | CustomEvent（e.detail）   |
| clear | 点击清空按钮时触发                 | 无                             |
| visible-change | 下拉框出现/隐藏时触发       | CustomEvent（e.detail:boolean） |

| 插槽 | 说明          | 
|---|-------------|
| 无 | | 

| 暴露方法  | 说明                  | 参数                    |
|-------|---------------------|-----------------------|
| handleOpen  | 打开日期选择器弹窗   | 无                     |
| handleClose  | 关闭日期选择器弹窗 | 无                     |

### fin-date-panel

日期选择器面板，可单独使用，也可以集成到表单中使用

| 属性            | 说明            | 类型     | 默认值      |
|---------------|---------------|-------------|----------|
| value         | 选中值           | string、array     |          |
| multiple         | 是否多选     | string、array   |          |
| disabled-date | 判断该日期是否被禁用的函数 |     function      |  |

| 事件     | 说明          | 参数                    |
|--------|-------------|-----------------------|
| change | 选中的值发生变化时触发 |function   |

| 插槽 | 说明          | 
|---|-------------|
| 无 | | 

### fin-month-panel

月份选择器面板，可单独使用，也可以集成到表单中使用


| 属性            | 说明            | 类型     | 默认值      |
|---------------|---------------|------------|----------|
| value         | 选中值           | string、array     |          |
| multiple         | 是否多选          | string、array     |          |
| disabled-date | 判断该日期是否被禁用的函数 |    function       |  |

| 事件     | 说明          | 参数                    |
|--------|-------------|-----------------------|
| change | 选中的值发生变化时触发 | function   |

| 插槽 | 说明          | 
|---|-------------|
| 无 | | 

### fun-year-panel

年份选择器面板，可单独使用，也可以集成到表单中使用

| 属性            | 说明            | 类型           | 默认值      |
|---------------|---------------|--------------|----------|
| value         | 选中值           | string、array |          |
| multiple      | 是否多选          | string、array |          |
| disabled-date | 判断该日期是否被禁用的函数 | function     |  |

| 事件     | 说明          | 类型       |
|--------|-------------|----------|
| change | 选中的值发生变化时触发 | function |

| 插槽 | 说明          | 
|---|-------------|
| 无 | | 

### fin-time-panel

时间选择器面板，可单独使用，也可以集成到表单中使用

| 属性            | 说明            | 类型           | 默认值      |
|---------------|---------------|--------------|----------|
| value         | 选中值           | string、array |          |
| multiple      | 是否多选          | string、array |          |
| disabled-time | 判断该日期是否被禁用的函数 | function     |  |

| 事件     | 说明          | 类型                    |
|--------|-------------|-----------------------|
| change | 选中的值发生变化时触发 | function   |

| 插槽 | 说明          | 
|---|-------------|
| 无 | | 

## 布局

### fin-row

默认使用 flex 布局

| 参数 | 说明                    | 类型     | 默认值  |
|---|-----------------------|--------|------|
| direction | 排列方向：flex-direction属性 | string |   row   |
| wrap | 是否换行                  |   string     |  |
| align-items | 纵向对齐方式                |   string     |  |
| justify-content | 对齐方式                  |   string     |  |

### fin-col

默认使用 flex 布局

| 参数              | 说明             | 类型     | 默认值 |
|-----------------|----------------|--------|-----|
| grow            | flex-grow 分配份数 | number | 1   |
| align-self      | 对齐方式           | string |     |
| order           | 子项顺序，值越小越前     | number |     |
| shrink          | 对齐方式           | number |     |

基于 flex 布局，同时要把兼容一些常用的布局场景

- `flex:1` 下内部元素撑开时能够正常出现滚动条

- `flex:1` 下的元素设置 ellipsis 属性时 ，内部文本元素能支持出现省略号

## 表格

### fin-table

问题：原生组件不支持带有作用域的插槽

按原生表格的写法使用

- fin-table
- fin-table-header
- fin-table-body
- fin-table-cell

### fin-pagination

分页器

| 参数              | 说明             | 类型            | 默认值                                  |
|-----------------|----------------|---------------|--------------------------------------|
| background            | 是否为分页按钮添加背景色 | boolean | false                                |
| page-size      | 每页显示条目个数           |  number|                                      |
| total          | 总条目数           | number |                                      |
| current-page          | 当前页数           | number |                                      |
| layout         | 组件布局，子组件名用逗号分隔           | string | prev, pager, next, jumper, ->, total |
| page-sizes         | 每页显示个数选择器的选项设置           | object | [10, 20, 30, 40, 50, 100]            |
| hide-on-single-page         | 只有一页时是否隐藏           |boolean  | true                                 |

| 事件     | 说明              | 类型       |
|--------|-----------------|----------|
| size-change | page-size 改变时触发 | Function |
| current-change | current-page 改变时触发    | Function |

### fin-popup

类似 select、picker 点击时出现的下拉框

- 自动固定在元素的底部，位置自动跟随元素所在位置的变化而变化

- 不受 overflow 影响

| 参数              | 说明                               | 类型     | 默认值  |
|-----------------|----------------------------------|--------|------|
| target          | parent、previous 、next，相对哪个元素进行定位 | string |   parent   |

### fin-button

| 参数              | 说明             | 类型            | 默认值                                  |
|-----------------|----------------|---------------|--------------------------------------|
| type            |类型 |  |                                 |
|plain     | 是否为朴素按钮           | boolean |                                      |
| circle          | 是否为圆形按           | boolean |                                      |
| text          | 是否为文字按钮           | boolean |                                      |
|loading          | 是否为加载中状态           | boolean |                                      |
|disabled          | 按钮是否为禁用状态           | boolean |                                      |
|icon          | 图标组件           | string |                                      |

| 插槽 | 说明          | 
|---|-------------|
| icon |自定义图标组件 | 

### fin-icon

| 参数        | 说明    | 类型            | 默认值                                  |
|-----------|-------|---------------|--------------------------------------|
| name      | 图标名称  |  |                                 |
| color     | 颜色    | boolean |                                      |
| size      | 尺寸    | boolean |                                      |
| iconStyle | 自定义样式 | boolean |                                      |


## todo

- root变量待研究
- LIB打包：目前只是做了全量打包
- 按需引入？
- icon 解决方案待确定
- 框架适配
  - 示例工程是直接运行在  vue3 环境的，所以 vue3 下就是当前的所见所得
  - 其它为做测试


## 参考

[momentum.design](https://momentum.design/components/combo-box/code)  
[Github](https://github.com/momentum-design/momentum-ui/blob/master/web-components/src/components/input/Input.ts)
[ui5](https://sap.github.io/ui5-webcomponents/playground/?path=/docs/main-select--docs)
[shoelace](https://shoelace.style/components/option)

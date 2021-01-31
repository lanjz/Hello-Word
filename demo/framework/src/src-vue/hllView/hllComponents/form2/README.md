# HllForm

```html
<HllForm :formConfig="formConfig" v-model="formModelData" />
```

以配置的形式生成表单, 依赖两个属性 `formModelData` 和 `formConfig`


- `formModelData` 用于绑定整个form 表单的值

- `formConfig` 为form的配置说明，`formConfig` 的每一项应为一个对象，通用的属性为：

  - type: 表单类型.input、select

  - label: 表单说明

  - model: 绑定值的属性名

  - `span`: 珊格布局，支持直接传入 带`px`的值

  - `offset`: 珊格布局，支持直接传入 带`px`的值

  针对不同类型的表单，可以根据elementUi 的配置说明，添加特定的属性

- `span`: 珊格布局，作用于 每一顶 formItem, 支持直接传入 带`px`的值

- `offset`: 珊格布局，作用于 每一顶 formItem, 支持直接传入 带`px`的值

`HllForm` 组件除了上面说明的 `formModelData` 和 `formConfig` 两个属性支持 elementUI 中绝大部分原有的属性，如 `placeholder`、`rules` 等等

`HllForm` 方法

- `validate`， 手动触发表单校验，用法同 elementUI 的 `validate`, 并添加了第三个参数返回当前表单的值

### select

`type=select` 时还需要以下属性

- `options`(必需): 下拉选项

- `group`: 是否分组。分组时 `options` 的格式如下：

  ```js
    options: [
       {
         label: '热门城市',
         options: [{
           value: 'Shanghai',
           label: '上海'
         }, {
           value: 'Beijing',
           label: '北京'
         }]
       }, {
         label: '城市名',
         options: [{
           value: 'Chengdu',
           label: '成都'
         }, {
           value: 'Shenzhen',
           label: '深圳'
         }, {
           value: 'Guangzhou',
           label: '广州'
         }, {
           value: 'Dalian',
           label: '大连'
         }]
       }
     ]

  ```

- `optionRender`(可选): 当前需要对 option进行个性化布局时，可以使用 `render` 方法进行呈现

  ![](./images/optionRender.jpg)

  比如上实现上面这种效果，则对应的 `formConfig` 配置如下：

  ```js
   {
        type: 'select',
        label: '活动区域',
        model: 'region',
        options: [
          {
            label: '区域一',
            value: 'shanghai',
          },
          {
            label: '区域二',
            value: 'beijing',
          }
        ],
        optionRender: function (createElement, option, formItemData){
          console.log('option', option)
          return createElement('div', [
            createElement('span', {style: "float: left"}, option.label),
            createElement('span', {style: "float: right; color: #8492a6; font-size: 13px"}, option.value),
          ])
        },
        rules: [
          { validator: this.validTem, trigger: 'blur' }
        ],
   },
  ```

  上面这种呈现形式当元素较多时将变得难以阅读，所以实际使用时，应将渲染内容单独封装成组件再使用 `createElement` 进行渲染

  ```js
    import OptionCom from './OptionCom'
    optionRender: function (createElement, option, formItemData){
      console.log('option', option)
      return createElement(OptionCom, { props: { option } })
    }
  ```

### Cascader

同 select 支持 通过`optionRender` 自定内容, ` function (createElement, data, node, option, formDara)` 参数表示：

- `createElement`：创建节点方法

- `data`: 当前节点的信息

- `node`：完整的当前节点的信息

- `formDara`: 整个表单绑定的数据

### datePicker

`type=datePicker` 时只增加一个 `min` 和 `max` 属性，方便对可选时间进行限制，使用注册以下两点

- 当配置了elementUi 自带的 'picker-options' 属性时，以上两个属性都不会生铲

-  `min` 或 `max` 的值必需是可以被 `new Date(min|max)` 执行的值

- 如果 `min` 或 `max` 需要返回当前组件的某个属性，需要以函数的形式返回,这样就可以方便与表单另个时间选择器进行联动限制了

   ```js
     {
         type: 'datePicker',
         label: '结束时间',
         model: 'date2',
         placeholder: '选择时间',
         min: () => {
           return this.formModelData.date1
         },
       },
   ```

### checkbox

`type=checkbox` 增加了以下属性

- `useButton`：是否以 el-checkbox-button 的形式呈现

- `showCheckAll`：是否以显示全选按钮（待完善）

## 插槽

添加插槽时，formConfig 只需要提供 `type` 和 `slotType` 即可

```html
<HllForm
  :formConfig="formConfig"
  v-model="formModelData"
>
<template v-slot>
  <p>Here's some contact info</p>
</template>
</HllForm>
```
```js
formConfig: [
    {
      type: 'slot',
      slotType: 'footer',
    }
  ]
```

## render

支持渲染函数的形式渲染元素，formConfig 只需要提供 `type` 和 `render` 即可

```js
formConfig: [
    {
      type: 'render',
      render: function (h, item, formDara){
        /**
          h => createElement方法,
          itme => 当前项的配置
          formDara => 当前 Form 绑定的值
        */
        console.log('item', item, formDara)
        return h('p', 'No items found.')
      }
    }
  ]
```


## 其它注意点

配置 `formConfig` 时，第一层的配置的属性会全部添加到组件属性当中

非第一层的属性（如 select的options配置 ）并没有这么做，只取关键属性，这是因为怕属性选择冲突出现难以预测的问题，关于这点之后根据实际使用情况进行调整

因此，无论何时，建议配置 `formConfig` 睦尽量只传递必要的配置

# 配置化表单（c-form）

```vue
<CForm
  :model="conditionForm"
  ref="conditionForm"
  label-width="100px"
  inline
  :column="searchColumn"
>
</CForm>
```

## 功能 / 作用

1. 通过配置 JSON 自动生成表单内容

2. 内联表单模式下自动集成 `收起/展开功能`

3. 此组件的目的在于快速实现表单开发，减少代码量，提高工作效率

## 属性说明

### `column` 配置项

eg：

```js
export function searchConfig(){
  return [
    {
      prop: 'name',
      label: '姓名',
      render: 'el-input',
      itemFormAttr: {
        rules: [ { required: true, message: '请输入活动名称', trigger: 'blur' },
        ]
      }
    },
    {
      prop: 'region',
      label: '活动区域',
      render: 'el-select',
      itemFormAttr: {
        rules: [ { required: true, message: '请选择活动区域', trigger: 'change' },]
      },
      child: [
        {label: '区域一', value: 'shanghai', render: 'el-option'},
        {label: '区域二', value: 'beijing', render: 'el-option'},
      ]
    },
    {
      prop: 'age',
      label: 'RRR"',
      render: (h, form, root) => (
        <el-input-number
          v-model={form.age}
          max={20}
        />
      )
    },
  // 多元素渲染
  {
      label: '选择日期',
      renderList: [
          {
              prop: 'date1',
              label: '选择日期',
              render: 'el-date-picker',
              colSpan: 11,
              style: 'width: 100%;'
          },
          {
              render: (h) => (<span>-</span>),
              colSpan: 2,
          },
          {
              prop: 'date2',
              label: '选择时间"',
              render: 'el-time-picker',
              colSpan: 11,
              style: 'width: 100%;'
          }
      ]
  },
  ]
}
```

每一项的配置属性说明：

- `prop {String}`：双向绑定的属性

- `name {String|undefine}`: 表单 label

- `child {Array[element]}`：元素的子元素，如配置 `el-select` 的 `el-option`

- `render {String | JSX}`: 个性化元素渲染，如果是字符串，这个字符串应该是有项的 Html 标签或者是全局组件名

- `renderList {Array[column]}`：多元素渲染

- `colSpan {Number|String}`： 栅格属性，默认为 24 占整行

- `itemFormAttr {Object}`: 除了 `prop` 和 `name` 属外其它 `el-form-item` 支持的属性

- `show {Function}`: 控制该表单项是否显示，方法会传入表单双向绑定的 mode 对象，此属性功能待改善，不推荐使用

**column 定义注意事项**

1. `searchColumn` 可以直接定义成一个数组，如果需要使用组件中的属性，可以定义函数，通过传参的形式进行访问

2. 不推荐直接绑定组件 `this` ，如例子

    ```js
    data(){
        return {
            searchColumn: searchColumn.call(this)
        }
    }
    ```

    这么定义好处是 `searchColumn` 方法内容可以直接通过 `this` 访问组件实例，更方便直接访问组件的中的属性方法等元素，但是这种方式会让组件的属性方法是否被使用被得很难预算

#### model 属性

整个表单双向绑定的值

#### hideAction 属性

默认情况下 CForm 内置了两个按钮 `确定` 和 `取消`， 分别通过  `@confirm` 和 `@reset` 来接收对应用的事件，这个属性用于控制不显示按钮

#### loading 属性

控制表单内置按钮的 `loading` 状态

#### inline 属性

同 `el-form` 中 `inline` 的作用，它表示表单是否为内联表单， CForm 对于 `inline` 会添加以下功能：

- 添加表单的收起/展开功能

- 对于按钮的展示会进行动态处理，具体可以体验一下使用例子

### defaultOpen

收起时显示几行表单，默认显示一行

#### keep 属性

如果有 `inline` 属性， CForm 会自动添加表单的收缩功能，传入 `keep` 属性则表示禁用此功能

#### formClass 属性

CForm 默认添加了 `c-form` 类名，如果需要添加自定义的类名，通过 `formClass` 属性进行设置

### 按钮插槽

如果需要自己配置按钮，可以通过插槽（v-slot:action） 进行配置. eg:

```vue
  <CForm
      :model="conditionForm"
      ref="conditionForm"
      label-width="100px"
      inline
      :column="searchColumn"
  >
    <template v-slot:action>
      <div>
        <el-button
            type="primary"
            @click="queryData"
            size="small"
            v-if="btns && btns['QueryUserData']"
        >{{ $t("userListLang.search") }}</el-button>
      </div>
    </template>
  </CForm>
```

:::tip
如果插槽中的内容有用到 `v-if` 之类的显示控制，最外层需要使用一个元素(如 div)进行包裹

```vue
<template v-slot:action>
   <el-button
           type="primary"
           @click="queryData"
           size="small"
           v-if="btns && btns['QueryUserData']"
   >{{ $t("userListLang.search") }}</el-button>
</template>
```

上面的例子中当 `v-if` 条件为 `false` 时，Vue 会认为当前没有自定义插槽，此时会显示内置的按钮
:::


### 支持以 elementUI 原始的方法进行进行

比如只想使用 CForm 的收起展开功能，又不想改成配置化的形式，那么只需要用 `CForm` 代替 `el-form`标签即可

## 组件方法

- `validate(cb)`： 同 el-form 的 `validate(cb)` 方法

- `validateField(props, cb)`： 同 el-form 的 `validateField(props, cb)` 方法

- `resetFields()`： 同 el-form 的 `resetFields()` 方法

- `clearValidate(props)`： 同 el-form 的 `clearValidate(props)` 方法

- `toggleOpen()`： 控制表单的伸缩

- `getFormEl()`： 返回 el-form 实例

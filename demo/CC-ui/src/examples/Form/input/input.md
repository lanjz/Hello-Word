# Input

input

### todo

- formatter 添加几个内置类型： number（添加小数点）、千分位
- type 只试了 text和password，缺少切换明文功能

### 说明

- 作为承载容器组件的元素

- 可灵活设置挂载节点
- autosize属性

### Attributes
| 参数        | 说明                                                           | 类型              | 默认值   |
|-----------|--------------------------------------------------------------|-----------------|-------|
| v-model   | value/input                                                  | string          |   |
| type      | 输入框占位文本                                                      | string          |   |
| placeholder| 类型                                                           | string          | text  |
| formatter | 对输入的value进行过滤，如果是string则为内置的过滤函数                             | function、string | null  |
| disabled  | 是否禁用                                                         | boolean         | false |
| clearable | 是否显示清除按钮                                                     | boolean         | false |
| show-word-limit | 是否显示统计字数, 只在 type 为 'text' 或 'textarea' 的时候生效    | boolean         | false |
| show-password | 是否显示切换密码图标                                                   | boolean         | false |
| maxlength | 最大输入长度                                                       | string/ number  |  |
| minlength | 原生属性，最小输入长度                                                  | string/ number  |  |
| rows | 输入框行数，仅 type 为 'textarea' 时有效                                |  number         |  |
| autocomplete | 原生 autocomplete 属性                                           |  string         | off |
| name | 等价于原生 input name 属性                                          |  string         |  |
| readonly | 原生  readonly 属性，是否只读                                         |  boolean         | false |
| max | 原生 max 属性，设置最大值                                              |           |  |
| min | 原生 min 属性，设置最小值                                              |           |  |
| step | 原生属性，设置输入字段的合法数字间隔                                           |           |  |
| autofocus | 原生属性，自动获取焦点                                            |     boolean      |  |
| form | 原生属性                                                         |     string      |  |
| input-style | input 元素或 textarea 元素的 style                                 |     string      |  |

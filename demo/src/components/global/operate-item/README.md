# CIconOperate

这个组件是用于表格操作区域的，方便设置 `icon` 操作按钮. 组件支持的属性有：

- `type {String}`：按钮类型，默认不同的按钮类型会使用不同的 icon

   ```
   edit: 'iconicon_edit',
   look: 'iconic_view1',
   del: 'iconic_edit',
   tool: 'iconic_set',
   ```

- `icon {String}`: 使用 className 显示的 icon，会覆盖上面的默认 icon

- `text {String}`: ICON 按钮的文字说明

- `noIcon {Boolean}`：表示直接使用 text 显示

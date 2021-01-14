# HLLUpload

基于 `el-upload` 的二次封装

**支持 `el-upload` 原有的属性配置**

`HLLUpload` 默认的属性配置如下：


- name: 'multipartFiles' 上传文件字段名

- action: '/api/attachment/uploadfiles' 上传接口地址

- drag: true 支持拖动上传

- autoUpload: true 是否在选取文件后立即进行上传

- listType: 'text' 文件列表的类型

- multiple: true 支持多选文件

- accept: [ '.jpg', '.JPG', , '.PNG', '.jpeg', '.JPEG','.gif','.GIF', '.pdf', '.PDF', '.xlsx', '.XLSX', '.xls', '.XLS',  '.doc', '.DOC', '.zip', '.ZIP' ] 支持上传文件格式

- data{Object}: 上传时额外参数，默认添加了 { formId: '1000' }，如果有传其它参数将会进行合并

- fileList{Array}：文件列表

- beforeUpload{Function}: 上传前的钩子，做了文件大小的判断

- onRemove{Function}: 执行删除的回调，执行成功后将通过 `this.$emit('removeResult', result)`，回传删除结果

- beforeRemove{Function}: 执行删除操作前的判断，目前做了权限判断

- onSuccess{Function}: submit 文件后的回调，结果将通过 `this.$emit('handleUploadSuccess', result)`，回传submit结果

- onError: submit 文件失败后的回调，将通过 `this.$emit('uploadResult', [result])` 回传失败结果

- onPreview: 点击文件后的操作，将执行 $PreviewFile 方法进行预览

上面的所有属性都是在 `el-upload` 组件的基础上做的属性和回调的配置，如果有不满足当前业务需要的，可以通过同名参数进行覆盖

`HLLUpload` 组件额外添加几个属性：

- `ifNecessary`，上传时是否添加 * 号标识

- `title`, 上传按钮名称

- `beforeBeforeRemove{Function}`, 执行 `beforeRemove` 方法之前的钩子，返回 `false` 表示取消删除操作

- `beforeBeforeAvatarUpload{Function}`，执行 `beforeUpload` 方法之前的钩子，返回 `false` 表示取消上传操作

`HLLUpload` 组件额外添加回传事件：

- `removeResult`: 执行参数后的回调

- `uploadResult`: 执行上传参数后的回调，为了兼容手动上传的情况，参数是个结果数据

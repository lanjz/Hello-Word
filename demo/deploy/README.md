# deploy-ssh

前端一键部署

## 使用方式

在项目根目录添加文件 `deploy.config.js`

可以添加多种命令组合

```js
module.exports = {
 dev: {
   host:  "", // 服务器地址
   port: "", // 服务器端口
   username: "", // 服务器登录用户名
   password: "", // 服务器登录密码
   distPath: "build", // 要上传的文件
   publishPath: "", // 服务器放置项目的路径
   unzipDirName: undefined, // 压缩的文件名，解压后的文件名，默认与 distPath 一致
   isRemoveRemoteZip: true, // 发布成功后是否删除上传的压缩文件
   isRemoveLocalZip: true, // 发布成功后是否删除本地的压缩文件
   exec: '' // 边上ssh后，直接执行的shell 命令，那么其它任务都不会执行
 }
}
```

比如上面的配置添加了 `dev` 环境的配置

然后运行方法： `deploy-ssh --dev`
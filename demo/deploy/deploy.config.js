module.exports = {
 dev: {
   host:  "", // 服务器地址
   port: "", // 服务器端口
   username: "", // 服务器登录用户名
   password: "", // 服务器登录密码
   distPath: "build", // 要上传的文件
   publishPath: "", // 服务器放置项目的路径
   unzipDirName: undefined, // 解压后的文件名，默认与 distPath 一致
   isRemoveRemoteZip: true, // 发布成功后是否删除上传的压缩文件
   isRemoveLocalZip: true, // 发布成功后是否删除本地的压缩文件
   exec: ''
 }
}
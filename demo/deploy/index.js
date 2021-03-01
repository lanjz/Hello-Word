const path = require('path');
const archiver =require('archiver');
const fs = require('fs');
const { NodeSSH } = require('node-ssh')
const ssh = new NodeSSH();
const { log, err } = require('./utils/index')
const cwd = process.cwd()
let deployConfigPath = path.resolve(cwd, './deploy.config.js')
if(!fs.existsSync(deployConfigPath)){
  err(`请添加deploy.config.js文件`, deployConfigPath)
  return
}
const deployConfig = require(deployConfigPath);
let ENV = process.argv[2]
const config = deployConfig&&deployConfig[ENV] ? deployConfig[ENV] : null
if(!config){
  err(`需要完善配置信息`)
  return
}
const srcPath = path.resolve(cwd, config.distPath); // 要上传的文件
if(!fs.existsSync(srcPath)){
  err(`不存在${config.distPath}目录`)
  return
}
const localZipPath = path.resolve(cwd, `${config.distPath}.zip`); // 压缩名件名
let remotePublishZipPath = path.resolve(config.publishPath, `${config.distPath}.zip`)
let remotePublishPath = path.resolve(config.publishPath, `/${config.distPath}`)

async function doExec(){
  try {
    await connectSSH() // 连接 ssh
    await runExec(config.exec) // 连接 ssh
  }catch (err){
    err(err)
  }finally {
    process.exit(0);
  }
}
//执行远端部署脚本
async function doJob() {
  try {
    await startZip() // 压缩
    await connectSSH() // 连接 ssh
    await uploadFile() // 上传
    await removeRemoteFile() // 移除原来的目录
    await unzipRemoteFile() // 解压文件
    if(config.isRemoveRemoteZip){
      await removeRemoteZip() // 移除上传的压缩包
    }
    if(config.isRemoveLocalZip){
      await removeLocalZip() // 移除本地的压缩包
    }
  }catch (err){
    err(err)
  }finally {
    process.exit(0);
  }
}
//压缩文件
function startZip() {
  log('开始压缩目录...');
  return new Promise((resolve, reject) => {
    const archive = archiver('zip', {
      zlib: { level: 9 } //递归扫描最多5层
    })
      .on('error', function(err) {
        err('压缩失败')
        reject(err);//压缩过程中如果有错误则抛出
      });
    const output = fs.createWriteStream(localZipPath)
      .on('close', function(err) {
        /*压缩结束时会触发close事件，然后才能开始上传，
          否则会上传一个内容不全且无法使用的zip包*/
        if (err) {
          err('关闭archiver异常:',err);
          reject(err)
          return;
        }
        log('已生成zip包');
        resolve();
      });

    archive.pipe(output);// 压缩内容输出到 zip
    archive.directory(srcPath, false); // 压缩内容直接放在zip包的根目录中
    // archive.directory(srcPath, '/public');// 压缩内容放在zip包目录中 '/public' 路径中
    archive.finalize(); // 执行打包
  })
}
// 上传文件
function connectSSH(){
  log('开始ssh连接...');
  return ssh.connect({
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
  }).then(function () {
    log('ssh连接成功...');
  }).catch(err=>{
    err('ssh连接失败:',err);
    throw err
  });
}
// 上传文件
function uploadFile(){
  log('上传本地压缩文件');
  //上传网站的发布包至configs中配置的远程服务器的指定地址
  return ssh.putFile(localZipPath, remotePublishZipPath).then(function(status) {
    log('上传文件成功');
  }).catch(err=>{
    err('文件传输异常:',err);
    throw err
  });
}
// 解压上传的文件
function unzipRemoteFile(){
  log('开始解压文件：', remotePublishZipPath)
  return ssh.execCommand(`unzip -o ${remotePublishZipPath} -d ${remotePublishPath}`)
    .then(() => {
      log('解压成功')
    })
    .catch(err => {
      err('解压失败')
      throw err
    })
}
function removeRemoteFile(){
  log('删除远程文件：'+remotePublishPath)
  // 货拉拉需要使用 /bin/rm 删除文件
  return ssh.execCommand(`/bin/rm -rf ${remotePublishPath}`)
    .then(() => {
      log('删除远程文件成功')
    })
    .catch(err => {
      err('删除远程文件失败')
      throw err
    })
}
function removeRemoteZip(){
  log('删除远程压缩文件：'+remotePublishZipPath)
  // 货拉拉需要使用 /bin/rm 删除文件
  return ssh.execCommand(`/bin/rm -rf ${remotePublishZipPath}`)
    .then(() => {
      log('删除远程压缩文件成功')
    })
    .catch(err => {
      err('删除远程压缩文件失败')
      throw err
    })
}
function removeLocalZip(){
  log('删除本地压缩文件:'+localZipPath)
  fs.unlinkSync(localZipPath)
  log('成功删除本地压缩文件')
}
function runExec(code){
  return ssh.execCommand(code)
    .then(() => {
      log('执行命令成功', code)
    })
    .catch(err => {
      log('执行命令成功')
      throw err
    })
}
if(config.exec){
  doExec(); // 连接ssh 直接执行命令的
} else {
  doJob();
}


/**
 * 在服务器上cwd配置的路径下执行sh deploy.sh脚本来实现发布
  ssh.execCommand('sh deploy.sh', { cwd:'/usr/bin/XXXXX' }).then(function(result) {
    err('远程STDOUT输出: ' + result.stdout)
    err('远程STDERR输出: ' + result.stderr)
    if (!result.stderr){
      err('发布成功!');
      process.exit(0);
    }
  });
 */
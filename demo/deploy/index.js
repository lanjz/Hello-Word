const path = require('path');
const archiver =require('archiver');
const fs = require('fs');
const { NodeSSH } = require('node-ssh')
const ssh = new NodeSSH();
const srcPath = path.resolve(__dirname,'./dist');
const config = require('./config');

let localPublishZipPath = __dirname + '/public.zip'
let remotePublishZipPath = config.publishPath + '/public.zip'
let remotePublishPath = config.publishPath + '/public'
//压缩dist目录为public.zip
function startZip() {
  console.log('开始压缩dist目录...');
  const archive = archiver('zip', {
    zlib: { level: 9 } //递归扫描最多5层
  })
    .on('error', function(err) {
      console.log('压缩失败')
      throw err;//压缩过程中如果有错误则抛出
    });
  const output = fs.createWriteStream(__dirname + '/public.zip')
    .on('close', function(err) {
      /*压缩结束时会触发close事件，然后才能开始上传，
        否则会上传一个内容不全且无法使用的zip包*/
      if (err) {
        console.log('关闭archiver异常:',err);
        return;
      }
      console.log('已生成zip包');
      uploadFile();
    });

  archive.pipe(output);// 压缩内容输出到 zip
  archive.directory(srcPath, false); // 压缩内容直接放在zip包的根目录中
  // archive.directory(srcPath, '/public');// 压缩内容放在zip包目录中 '/public' 路径中
  archive.finalize(); // 执行打包
}

//将dist目录上传至正式环境
function uploadFile() {
  console.log('开始ssh连接...');
  ssh.connect({
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
  }).then(function () {
    console.log('ssh连接成功...');
    console.log('上传本地压缩文件');
    //上传网站的发布包至configs中配置的远程服务器的指定地址
    ssh.putFile(localPublishZipPath, remotePublishZipPath).then(function(status) {
      console.log('上传文件成功');
      startRemoteShell();// 上传成功后触发远端脚本
    }).catch(err=>{
      console.log('文件传输异常:',err);
      process.exit(0);
    });
  }).catch(err=>{
    console.log('ssh连接失败:',err);
    process.exit(0);
  });
}

//执行远端部署脚本
async function startRemoteShell(remotePublishPath) {
/*  //在服务器上cwd配置的路径下执行sh deploy.sh脚本来实现发布
  ssh.execCommand('sh deploy.sh', { cwd:'/usr/bin/XXXXX' }).then(function(result) {
    console.log('远程STDOUT输出: ' + result.stdout)
    console.log('远程STDERR输出: ' + result.stderr)
    if (!result.stderr){
      console.log('发布成功!');
      process.exit(0);
    }
  });*/
  try {
    await removeRemoteFile()
    await unzipRemoteFile()
  }catch (err){
    console.log(err)
  }finally {
    process.exit(0);
  }
}
// 解决上传的文件
function unzipRemoteFile(){
  console.log('开始解压文件', remotePublishZipPath)
  return ssh.execCommand(`unzip -o ${remotePublishZipPath} -d ${remotePublishPath}`)
    .then(() => {
      console.log('解压成功')
    })
    .catch(err => {
      console.log('解压失败')
      throw err
    })
}
function removeRemoteFile(){
  console.log('删除远程文件')
  // 货拉拉需要使用 /bin/rm 删除文件
  return ssh.execCommand(`/bin/rm -rf ${remotePublishPath}`)
    .then(() => {
      console.log('删除远程文件成功')
    })
    .catch(err => {
      console.log('删除远程文件失败')
      throw err
    })
}
startZip();
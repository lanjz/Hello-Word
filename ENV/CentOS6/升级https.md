# certbot

在[certbot官网](https://certbot.eff.org/lets-encrypt/centos6-nginx)输入自己的系统型号，就有出现相关配置教程、

# 可能出现的问题

## 1. `Bootstrapping dependencies for RedHat-based OSes that will use Python3.`


完整的错误：

  ```
Bootstrapping dependencies for RedHat-based OSes that will use Python3... (you can skip this with --no-bootstrap)
yum is /usr/bin/yum
To use Certbot, packages from the EPEL repository need to be installed.
Enabling the EPEL repository in 3 seconds...[0K Enabling the EPEL repository in 2 seconds...[0K Enabling the EPEL repository in 1 second...
Loaded plugins: fastestmirror
Setting up Install Process
Loading mirror speeds from cached hostfile
* base: repos-lax.psychz.net
* elrepo-kernel: repos.lax-noc.com
* extras: mirror.scalabledns.com
* updates: mirror.web-ster.com
Package epel-release-6-8.noarch already installed and latest version
Nothing to do
No supported Python package available to install. Aborting bootstrap!
  ```

翻译完：

```
引导依赖基于RedHat的操作系统，将使用Python3 ...（你可以跳过这个--no-bootstrap）
yum是/ usr / bin / yum
要使用Certbot，需要安装EPEL存储库中的软件包。
在3秒内启用EPEL存储库...？在两秒内启用EPEL存储库...？在1秒内启用EPEL存储库...
加载的插件：最快的镜像
设置安装过程
从缓存的主机文件加载镜像
* base：repos-lax.psychz.net
* elrepo-kernel：repos.lax-noc.com
* extras：mirror.scalabledns.com
*更新：mirror.web-ster.com
包epel-release-6-8.noarch已经安装并且最新版本
空闲
没有支持的Python软件包可供安装。 中止bootstrap！
```

## [解决方案：升级python到3.X](https://zhuanlan.zhihu.com/p/34024112)

1. 下载&安装
    
    - 进入`/usr/local`目录下载python并解压

    ```
    wget https://www.python.org/ftp/python/3.5.2/Python-3.5.2.tgz

    tar -zxvf Python-3.5.2.tg
    ```

   -  ```
     # cd Python-3.5.2/
    # ./configure 
    ```

-  编译&安装

  `sudo make`

  `sudo make install`

2. 验证

  进入`/usr/local/bin`查看是否存在`Python3.X`文件


     ```
     python -V  // Python 2.6

     python3  -V // Python 3.5.2
    ```

  如果输出`python3`没有找到命令的话，说明在`/usr/local/bin`不存在`Python3`文件，没有也没关系


3.  设置 3.x 为默认python版本

    - 设置 3.x 为默认版本后会导致`yum`不可用，因为`yum`使用的低版本的python，我们将python默认指向高版本的phthon之后会出问题，所以先修改`yum`配置文件`cd /usr/bin/yum`，将第一行`#!/usr/bin/python` 改为 `#!/usr/bin/python2.6`  即之前默认版本
    - 执行`yum`，先验证一下`yum`是否可以正常使用

    - 将原来 python 的软链接重命名`mv /usr/bin/python /usr/bin/python.bak`

    - 将 python 链接至 python3：`ln -s /usr/local/bin/python3 /usr/bin/python`

    - 这时，再查看 Python 的版本：` python -V  // Python 3.5.2`

然后再重新执行`sudo /usr/local/bin/certbot-auto --nginx`应该就能成功了

## 验证升级成功

查看`nginx`配置，是否自动添加了SSL之类的配置

如果有的话重启`nginx`：`service nginx restart`

### 如果提示`Nginx is unable to bind to 443`的错误,则执行以下命令

```
sudo fuser -k 443/tcp
service nginx restart

```

# 注意点

https使用443端口，主要vpn设置是否也是443端口，以免冲突，如果冲突的话，可以先修改vpn的商品，再配置`nginx`

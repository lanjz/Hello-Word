---
sidebar: auto
---

# Git

一直以为 Git、Github、Gitlab 是同一家，原来搞错了~~

**Git** 是一个版本管理工具，是可以在你电脑不联网的情况下，只在本地使用的一个版本管理工具，其作用就是可以让你更好的管理你的程序，比如你原来提交过的内容，以后虽然修改了，但是通过 Git 这个工具，可以把你原来提交的内容重现出来，这样对于你后来才意识到的一些错误的更改，可以进行还原

同属版本控制系统软件还有 SVN,CVS 等

## Git+

**GitHub**

GitHub 是代码托管平台,提供代码托管服务，即不用自己搭建git服务器，直接使用GitHub作为远程仓库，便可以使用 Git 管理自己的项目

**GitLab**

GitLab 是由 GitLabInc.开发，使用MIT许可证的基于网络的 Git 仓库管理工具，且具有 wiki 和 issue 跟踪功能。使用 Git 作为代码管理工具，并在此基础上搭建起来的 Web 服务。也可以作为 git 托管平台

### Git、GitHub与GitLab的区别

- Git是一种版本控制系统，是一种工具，用于代码的存储和版本控制。

- GitHub是一个基于Git实现的在线代码仓库，是目前全球最大的代码托管平台，可以帮助程序员之间互相交流和学习。

- GitLab是一个基于Git实现的在线代码仓库软件，你可以用GitLab自己搭建一个类似于GitHub一样的仓库，但是GitLab 有完善的管理界面和权限控制，一般用于在企业、学校等内部网络搭建Git私服

类似的代码托管平台还有：

- 国外：Bitbucket 、sourceforge

- 国内：码云 、coding 、csdn 、腾讯云TGit 、阿里云CRP、 百度效率云

## SSH-KEY

**是什么：**

SSH 指 secure shell（一种安全的网络协议），Git 使用这种协议进行远程加密登录。SSH 登录安全性由非对称加密保证，产生密钥时，一次产生两个密钥，一个公钥，一个私钥，在 Git 中一般分别命名为 `id_rsa.pub` 和 `id_rsa`

**作用**

SSH 方式单独使用非对称的秘钥进行认证和加密传输，和账号密码分离开来，所以平时可以不需要账号密码也可以访问仓库

Git 基于多种传输协议，其中最常用的就是 `https` 和 `ssh`。都是为了数据传输安全，那么设置 SSH 密钥的目的是为了节省输入用户名密码的过程，同时保证传输安全

### https和SSH的clone方式区别

在 Github 中 克隆仓库有两种模式：HTTPS 和 SSH，它们的区别如下：

- HTTPS：不管是谁，拿到 `url` 随便 `clone`，但是在 `push` 的时候需要验证用户名和密码

- SSH：`clone` 的项目你必须是拥有者或者管理员，而且需要在 `clone` 前添加 SSH Key。SSH 在 `push` 的时候，是不需要输入用户名的，如果配置SSH-Key的时候设置了密码，则需要输入密码的，否则直接是不需要输入密码的

### 总结 

所以平时配置 Github 时，才需要使用 `ssh-keygen -t rsa -c "邮箱"` 命令来生成 SSH-KEY，这为了方便我们使用 SSH 方法克隆项目时使用，但不是必需的

## 配置小记

### 同时配置 Github 和 Gitlab 的SSH-KEY

此时就要就要生成两份 SSH-KEY

**添加 github key**

```
ssh-keygen -t rsa -C "github邮箱"
```

此时默认生成 `id_rsa.pub` 和 `id_rsa` 两个文件

**添加 gitlab key**

```
ssh-keygen -t rsa -f ~/.ssh/id_rsa_gitlab -C "gitlab邮箱"
```

多了 `-f ~/.ssh/id_rsa_gitlab` 用于设置生成的 SSH 文件名，如果不设的时候就会覆盖之前生的 Github 的 SSH

**在`.ssh` 文件夹下里面创建一个 `config` 文件**

配置文件添加 Host 和 `IdentityFile` 的匹配关系，这样 Git 会根据当前操作的仓库地址自动使用对应在的 rsa 文件，内容参考：

```
# default-github                                                                       
Host github.com
HostName github.com
User lanjz
IdentityFile ~/.ssh/id_rsa
# git_lab_1                                                                         
Host git.xxx.com.cn
HostName git.xxx.com.cn
User lanjz
IdentityFile ~/.ssh/id_rsa_gitlab
# 也可以配置多个git_lab_2
Host git.xxxx.cn
HostName git.xxxx.cn
User lanjz
IdentityFile ~/.ssh/id_rsa_gitlab                               
```

检查是否成功 `ssh -T git@github`

### 使用账号密码CLONE项目

格式：`git clone http://邮箱(或用户名):密码@仓库`

如：

- git账号： `lanjz`

- git密码：`123@`

- 仓库：`https://git.test.com/abc/demo`

克隆命令：`git clone https://lanjz:123%40@git.test.com/abc/demo`

%40 表示 @

:::tip
如果帐号密码存在特殊字符，需要进行转换，可以使用 `encodeURIComponent` 方法转换后的结果进行代替
:::

## 回滚命令

`git reset`

```
// 回滚到上次提交状态，保留本地修改。
git reset HEAD~1
git reset <commit>

// 回滚，但不保留本地修改。
git reset --hard <commit>

// 从暂存区移除特定文件，相当于 unstage 一个文件。
git reset file

// 重置暂存区，相当于 unstage all。
git reset

// 清除掉所有未提交更改。相当于 unstage all + 撤销所有更改。
git reset --hard
```

**reset 后面的参数说明**

- hard：慎用！回滚到指定的版本，不保留修改的代码

  1. 移动本地库HEAD指针
  
  2. 重置暂存区
  
  3. 重置工作区

- soft: 仅仅是把本地库的指针移动了，而暂存区和你本地的代码是没有做任何改变的

   1. 移动本地库HEAD指针

- mixed: 回滚后，不仅移动了本地库的指针，同时暂存区的东西也没了，意思就是你上次添加到暂存区的文件没了

   1. 移动本地库HEAD指针
   
   2. 重置暂存区

- keep: 回滚后，本地代码就是你回退版本的代码,而暂存区是没有做任何改变的
 
   1. 移动本地库HEAD指针
  
   2. 暂存区不变
  
   3. 重置工作区
  
## Q&A

**OpenSSL SSL_connect: Connection was reset in connection to github.com:443**

1. 如果你开启了VPN，很可能是因为代理的问题，关掉VPN重试

**OpenSSL SSL_read: Connection was reset, errno 10054**

git config lfs.https://github.com/lanjz/Hello-Word.git/info/lfs.locksverify false
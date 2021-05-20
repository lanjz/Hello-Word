---
sidebar: auto
---

# Github使用小计

## 同时配置github和gitlab

**添加 gitlab key**

```
cd ~/.ssh
ssh-keygen -t rsa -C "******@***.cn"
// 或
ssh-keygen -t rsa -f ~/.ssh/id_rsa_gitlab -C "yourmail@xxx.com"
```

**在`.ssh` 文件夹下里面创建一个 `config` 文件**，内容参考：

配置文件添加 Host和 `IdentityFile` 的匹配关系，这样 Github 会根据当前 git 地址自动使用对应在的 rsa 文件

```
# default-github                                                                       
Host github.com
HostName github.com
User lanjz
IdentityFile ~/.ssh/id_rsa
# git_lab_1                                                                         
Host git.mysoft.com.cn
HostName git.mysoft.com.cn
User lanjz
IdentityFile ~/.ssh/id_rsa_gitlab
# 也可以配置多个git_lab_2
Host git.myscrm.cn
HostName git.myscrm.cn
User lanjz
IdentityFile ~/.ssh/id_rsa_gitlab                               
```

检查是否成功 `ssh -T git@github`

**最后配置好本地的全局账号**
   
```
git config --global user.name 'xxx'
git config --global user.email 'x@xxx'
```

## 使用账号密码CLONE项目

格式：`git clone http://邮箱(或用户名):密码@仓库`

如：

- git账号： `lanjz`

- git密码：`123`

- 仓库：`https://git.test.com/abc/demo`

克隆命令：`git clone https://lanjz:123@git.test.com/abc/demo`

## 回滚

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

# 电脑设置github和gitlab

1. 添加 gitlab key
  ```
  cd ~/.ssh
  ssh-keygen -t rsa -C "******@***.cn"
  ```

  或
  
  `ssh-keygen -t rsa -f ~/.ssh/id_rsa_gitlab -C "yourmail@xxx.com"`

2. 在`.ssh` 文件夹下里面创建一个 `config` 文件

  ```
  # default                                                                       
  Host github.com
  HostName github.com
  User lanjz
  IdentityFile ~/.ssh/id_rsa
  # two                                                                           
  Host git.mysoft.com.cn
  HostName git.mysoft.com.cn
  User lanjz
  IdentityFile ~/.ssh/id_rsa_gitlab
  # git_lab
  Host git.myscrm.cn
  HostName git.myscrm.cn
  User lanjz
  IdentityFile ~/.ssh/id_rsa_gitlab                                  
  ```

检查是否成功 `ssh -T git@github`

## 最后 我们只需要配置好本地的全局账号就算配置成功了
   
```
git config --global user.name 'xxx'
git config --global user.email 'x@xxx'
```

# 使用账号密码CLONE项目

格式：`git clone http://邮箱(或用户名):密码@仓库`

如：

- git账号： `lanjz`

- git密码：`123`

- 仓库：`https://git.test.com/abc/demo`

克隆命令：`git clone https://lanjz:123@git.test.com/abc/demo`
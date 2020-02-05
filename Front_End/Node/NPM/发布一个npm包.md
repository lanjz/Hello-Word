
> [npm 发布流程](https://www.jianshu.com/p/f3a2613bd08c)

1. 注册npm账号

2. 本地终端登录npm账号：`npm login`
  ```
  Username: YOUR_USER_NAME
  Password: YOUR_PASSWORD
  Email: YOUR_EMAIL@domain.com
  ```

3. 查看npm当前使用的用户：`npm whoami`

4. 创建npm包：`npm init packagename -y`

  `package.json` 中的字段

  必需带有的字段

  - name :包名(全部小写，没有空格，可以使用下划线或者横线)

  - version: 版本

  其他内容

  - author:作者信息

  - main:程序入口文件，一般都是 index.js

  - description:描述信息，有助于搜索

  - keywords:[] 关键字，有助于在人们使用 npm search 搜索时发现你的项目

  scripts:支持的脚本，默认是一个空的 test

  - license:默认是 MIT

  - bugs:当前项目的一些错误信息，如果有的话

  - dependencies:在生产环境中需要用到的依赖

  - devDependencies:在开发、测试环境中用到的依赖

  - repository:代码仓库

5. 发布

  -   将npm源切换为https://registry.npmjs.org/

  `npm set registry https://registry.npmjs.org/`

  - 发布：`npm publish`

## 执行`npm publish`时可以遇到的错误

1.  提示is not in the npm registry

  - 查看自己的npm是否使用了镜像，比如常用的淘宝镜像`http://registry.npm.taobao.org/`
  
  - 我们需要切回原来的`npm config set registry https://registry.npmjs.org/`

  - 重新执行`npm adduser`、`npm publish`


2. This package has been marked as private

  删除 package.json文件的 "private": true

3. you must verify your email before publishing a new package

  npm要求开发者提供了一个有效的电子邮件地址，并且在每次发布新的NPM包之前，需要验证你的电子邮件。

  所以登录npm官网，验证一下自己的邮件地址

示例：[black-hook-ui](https://github.com/lanjz/black-hook-ui)

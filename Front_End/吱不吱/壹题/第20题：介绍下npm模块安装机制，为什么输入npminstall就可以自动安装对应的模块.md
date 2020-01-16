## npm模块安装机制

- 发出`npm install`命令

- 查询`node_modules`目录之中是否已存在指定模块

    - 若存在，不再重新安装

    - 若不存在

      - npm向registry查询模块压缩包的网址

      - 存放在根下的`.npm`目录里

      - 解压压缩包到当前的项目的`node_modules`目录

## npm 实现原理

[
第 20 题：介绍下 npm 模块安装机制，为什么输入 npm install 就可以自动安装对应的模块？](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/22)

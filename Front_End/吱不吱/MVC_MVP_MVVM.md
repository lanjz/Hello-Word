# MVC、MVP、MVVM架构

后端MVC和前端MVC两种。这两种MVC的不同点如下

![](https://segmentfault.com/img/bVbcnl7?w=1123&h=793)

可以看到，前端的MVC其实是为了解决前端复杂JS模块化的问题，从后端MVC的V分出来的MVC，与后端MVC并没有直接的关系。前端的MVC中，M占的比例很低，
只指代数据。而后端V的比例很低，只有模版的部分

# MVC

- Model: 处理来自数据库和网络请示的数据

- View: 用户界面，一般采用XML文件进行界面的描述

- Controller：处理业务逻辑

## 工作原理

- 用户出发事件的时候，view层会发送指令到controller层，自己不执行业务逻辑

- Controller执行业务逻辑并且操作Model，但不会直接操作View，可以说它是对View无知的

- Controller执行业务逻辑并且操作Model，但不会直接操作View，可以说它是对View无知的

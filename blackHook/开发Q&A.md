# 游客模式

以下情况下将视为游客模式

- 未登录

- 登录了且登录账号与当前访问笔记所属账号不同

可手动切换为游客模式，做为预览使用

# Node请求问题

当在Node请求github api时，如题使用访问的是http的github接口

非get请求会变成get请求处理

导致接口调用一直不能成功

原来是因为github会把http重定向到https，至于为什么会变成get就不知了，所以要请求https的github接口
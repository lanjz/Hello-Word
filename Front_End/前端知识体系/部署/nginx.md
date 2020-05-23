# nginx配置

## 安装nginx

`brew install nginx`

主页目录： `/usr/local/var/www 文件夹下`

配置文件地址在: `/usr/local/etc/nginx/nginx.conf`

nginx安装地址： `/usr/local/etc/nginx/servers/`

## 使用

- 运行nginx：`nginx`

- 重新启动nginx: `nginx -s reload`

## 配置构成

一般来说，Nginx配置文件会由如下几个部分构成：

```
# 全局块
...              
# events块
events {         
   ...
}
# http块
http      
{
    # http全局块
    ...   
    # 虚拟主机server块
    server        
    { 
        # server全局块
        ...       
        # location块
        location [PATTERN]   
        {
            ...
        }
        location [PATTERN] 
        {
            ...
        }
    }
    server
    {
      ...
    }
    # http全局块
    ...     
}
```

在上述配置中我们可以看出，Nginx配置文件由以下几个部分构成:

- 全局块：配置影响nginx全局的指令。一般有运行nginx服务器的用户组，nginx进程pid存放路径，日志存放路径，配置文件引入，允许生成worker process数等。

- events块：配置影响nginx服务器或与用户的网络连接。有每个进程的最大连接数，选取哪种事件驱动模型处理连接请求，是否允许同时接受多个网路连接，开启多个网络连接序列化等

- http块：可以嵌套多个server，配置代理，缓存，日志定义等绝大多数功能和第三方模块的配置。如文件引入，mime-type定义，日志自定义，是否使用sendfile传输文件，连接超时时间，单连接请求数等

- server块：配置虚拟主机的相关参数，一个http中可以有多个server

- location块：配置请求的路由，以及各种页面的处理情况

## 创建一个server模块

```
server {
    listen      80;
    server_name lan.com;    
    
    location / {
        root    /usr/share/nginx/html;    
        index   index.html index.php;
     }
}
```

上面配置的意思是当访问`lan.com`（需要用host映射到本机）时，会返回`/usr/share/nginx/html`目录下的`index.html`或`index.php`


可以添加多个`location`

```
server {
    listen      80;
    server_name lan.com;    
    
    location / {
        root    /usr/share/nginx/html;    
        index   index.html index.php;
     }
    
    location ~ \.html$ {
        root     /usr/lan/www;
     }
}
```

上面配置的意思是当访问`lan.com`（需要用host映射到本机）时，先匹配到`location /`，在`/usr/share/nginx/html`目录下查找
`index.html`或`index.php`，当查找到`index.html`时，并不是直接返回这个`index.html`，而是使用`index.html`发起内部重定向
就像重新发起了`lan.com/index.html`请求一样，然后会匹配到`location ~ \.html$`，从而访问到
`/usr/lan/html`里的`index.html`


### location指令规则

**修辞符**

- `=`: 表示精确匹配，也就是`uri`要完全跟`=`号后面的值相同

- `^~`: 表示URI 以某个常规字符串开头，不是正则匹配

- `~`: 表示区分大小写正则匹配

- `~*`: 表示不区分大小写正则匹配。

**uri**

`uri`是指`url`中的除去协议和域名及参数后，剩下的部分，比如请求的`url`为：`http://www.test.com/test/index.php?page=1` ，则`uri`为：`/test/index.php`

### location匹配顺序

匹配顺序总结：

- 匹配的顺序是先匹配普通字符串，然后再匹配正则表达式。另外普通字符串匹配顺序是根据配置中字符长度从长到短，也就是说使用普通字符串配置的location顺序是无关紧要的
  
- 匹配成功了普通字符串location后还会进行正则表达式location匹配。有两种方法改变这种行为：

  - 其一就是使用`=`前缀，这时执行的是严格匹配，并且匹配成功后立即停止其他匹配，同时处理这个请求
  
  - 另外一种就是使用`^~`前缀，如果把这个前缀用于一个常规字符串那么告诉nginx 如果路径匹配那么不测试正则表达式。
  
  **需要注意的是正则表达式按照配置文件里的顺序测试。找到第一个匹配的正则表达式将停止搜索**

## 部署SPA打包项目

以React项目为，打包出来的`build`目录下，有一个`index.html`和一个存放静态资源的`static`目录

我们把`build`的目录放在上文的`/usr/lan/www`目录

对应的nginx 配置

```
server {
    listen      80;
    server_name lan.com;    
    
    location / {
        root    /usr/lan/www;    
        index   index.html index.php;
    }
}
```

部署SPA项目的时候，还有一个问题就是如果项目的路由使用的`hostory`模式，当我们直接访问路由时是访问不到的，比如我们直接访问`http://lan.com/about`,
会返回 `404`， 为什么呢？ 我们分析下匹配过程：

- 会匹配到`location /`

- 于在会在`/usr/share/nginx/html`录找`about`目录里的`index.html/index.php`但是这个路径并不是直实存在的

- 意味着没有匹配到资源，所以返回404,所以对于路由地址，我们需要都往首页文件跳转,由前端框架处理

```
location / {
        root    /usr/lan/www;    
        index   index.html index.php;
        try_files $uri $uri/ /index.html; # 添加了一个`try_files`属性，表示如果没有找到`$uri`资源则重定向到index.html
    }
```

## 缓存配置

```
location ~* \.(?:ico|css|js|gif|jpe?g|png)$ {
    expires 30d;
    add_header Vary Accept-Encoding;
            access_log off;
}

```
# nginx配置

Nginx("engine x")是一款是由俄罗斯的程序设计师Igor Sysoev所开发高性能的Web和反向代理服务器，
也是一个IMAP/POP3/SMTP代理服务器。

> 本文基于CentOS6系统下测试运行

## 安装 

如果没安装`nginx`则通过yum安装

`yum -y install nginx`

如果安装时提示：No package nginx available. Error: Nothing to do

找不到nginx包，所以先给yum添加nginx的yum源文件

```{r, engine='sh', count_lines}
rpm -ivh http://nginx.org/packages/centos/6/noarch/RPMS/nginx-release-centos-6-0.el6.ngx.noarch.rpm
Retrieving http://nginx.org/packages/centos/6/noarch/RPMS/nginx-release-centos-6-0.el6.ngx.noarch.rpm
```

查看是否安装成功

```
[root@67 ~]# nginx -v
nginx version: nginx/1.10.3
```

## 常用命令

查看nginx的安装目录

`which nginx`

查看nginx配置文件所在目录

`nginx -t`

启用nginx服务

```
service nginx start
// Starting nginx:       
```

停止nginx服务

```
service nginx stop
// Stopping nginx:       
```

重启nginx服务

```
service nginx restart
// Stopping nginx:
// Starting nginx:       
```

查看nginx 默认站点目录

`/usr/share/nginx/html`

## nginx配置文件

进入nginx配置目录，查看`nginx.conf.default`

`vi nginx.conf.default`

```
server {
    listen       80;   #配置监听端口
    server_name  localhost;  #配置域名

    #charset koi8-r;     
    #access_log  /var/log/nginx/host.access.log  main;

    location / {
        root   /usr/share/nginx/html;     #服务默认启动目录，表示访问根目录重定向到的文件夹
        index  index.html index.htm;    #默认访问文件
    }

    #error_page  404              /404.html;   # 用于配置404页面

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;   #错误状态码对应的显示页面
    # location后面的内容可以为正则匹配
    location = /50x.html {
        root   /usr/share/nginx/html;
    }

    # proxy the PHP scripts to Apache listening on 127.0.0.1:80
    
    #location ~ \.php$ {
    #    proxy_pass   http://127.0.0.1; # 代理的地址
    #}

    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    #location ~ \.php$ {
    #    root           html;
    #    fastcgi_pass   127.0.0.1:9000;
    #    fastcgi_index  index.php;
    #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
    #    include        fastcgi_params;
    #}

    # deny access to .htaccess files, if Apache's document root
    # concurs with nginx's one
    #
    #location ~ /\.ht {
    #    deny  all;
    #}
}
``` 

### Server配置说明

- listen ：添加需要监听的端口

- root：如果监听到访问是的3002端口，刚返回`D:\Project\Demo\black-hook-note-M\build`下的站点

- index ：首页文件名

- location /： 匹配路径

  - try_files $uri @fallback;：根据路径尝试寻找文件，如果没找到则重定向到@fallback

-  location @fallback：上面没有匹配到的路径

  -   rewrite .* /index.html break;：返回首页

- location ^~ /api/：如果链接带有/api/，则访问的是接口资源，这里转发到`3001`端口上
处理

- proxy_pass：设置反向代理，该指令是用来设置代理服务器的地址，可以是主机名称，IP地址加端口号等形式

注意：`location ^~ /api/`的配置中，不能写`localhost`，要不然请求接口时第一次会失败，第二次才能成功，所以要写`127.0.0.1`


## 配置端口转发

打开配置文件

`vi /etc/nginx/nginx.conf`

在http配置项内容添加转发配置

比如将80端口代理到3001端口上

```
server {
        listen       80;
        server_name  127.0.0.1:3001;
        location / {
           proxy_pass   http://127.0.0.1:3001;
        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
```

重启nginx

`service nginx restart`

## 配置静态项目及接口请求代理

如部署React打包的项目资，接口需要访问另个端口

```
  server {
    listen 3002;
    root D:\Project\Demo\black-hook-note-M\build;
    index index.html;
    location / {
                  try_files $uri @fallback;
                }
    location @fallback {
                rewrite .* /index.html break;
                }
    location ^~ /api/ {
            proxy_pass http://127.0.0.1:3001/api/;
       }
  }
```

### cookiey写不到浏览器问题：

1. Access-Control-Allow-Origin"对应的值不能为通配符“*”

2. 服务端Header中设置`ctx.set("Access-Control-Allow-Credentials", true)`;

3. 在前端请求时应加入设置`withCredentials`为`true`否则，依然不会发送Cookie
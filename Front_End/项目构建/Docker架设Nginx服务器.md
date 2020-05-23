# Docker架设Nginx服务器

1. 下载`Nginx Image`： `docker pull nginx`

2. 启动 `nginx`： `docker run -d -p 80:80 nginx`

3. 浏览器输入`localhost:80`访问

但是使用`nginx`往往需要做一些配置，如果进入 docker 容器中配置明显不太方便，所以我们 docker 中的`nginx` 应该使用本机的配置文件，
那么就是做个类似软链接的操作

首先得知道docker中的`nginx`配置文件在哪?

- `nginx.conf`配置文件路径: `/etc/nginx/nginx.conf`

- `default.conf`配置文件的路径: `/etc/nginx/conf.d/default.conf`
    
- 默认首页文件夹html路径: `/usr/share/nginx/html`

- 日志文件路径: `/var/log/nginx`

在本机下创建以上对应的文件:

- `nginx.conf`配置文件路径: `/etc/nginx/nginx.conf`

- `default.conf`配置文件的路径: `/etc/nginx/conf.d/default.conf`
    
- 默认首页文件夹html路径: `/etc/nginx/html`

- 日志文件路径: `/etc/nginx/logs/error.log`

- 日志文件路径: `/etc/nginx/logs/access.log`

这里比较方式是直接容器把这些文件复制到本机来，复制命令：

- `docker container cp [containID]:[/path/to/file] [本机路径]`

在mac下把需要的文件先创建好，要不然会出现不能创建文件的权限问题

最后就可以启动 nginx 容器了：

```
docker run --privileged=true \
  --name lanjzNginx \
  -d -p 80:80 \
  -v /etc/nginx/html:/usr/share/nginx/html \
  -v /etc/nginx/nginx.conf:/etc/nginx/nginx.conf \
  -v /etc/nginx/conf.d/default.conf:/etc/nginx/conf.d/default.conf \
  -v /etc/nginx/logs:/var/log/nginx \
  nginx
```

## docker-compose

向上面直接使用`docker run`命令要输入很长字符，可以使用`docker-compose`管理我们`container`的启动和停止

创建一个文件`docker-compose.yml`，写入以下内容：

```
# vim: set shiftwidth=2 tabstop=2 softtabstop=-1 expandtab:

version: '3.0'
services:
  nginx:
    image: nginx:latest
    restart: unless-stopped
    container_name: nginx_one_3
    volumes:
      - /etc/nginx/html:/usr/share/nginx/html
      - /etc/nginx/nginx.conf:/etc/nginx/nginx.conf
      - /etc/nginx/conf.d/default.conf:/etc/nginx/conf.d/default.conf
      - /etc/nginx/logs:/var/log/nginx 
      - /Users/lanjz/code/node/gits_lan/Hello-Word/Front_End/前端知识体系/JavaScript/单页面框架/React/Demo/my-app/build;:/usr/lan/html
    ports:
      - 80:80
    environment:
      - NGINX_HOST=your.domain
      - NGINX_PORT=80
```

在当前目录下使用`docker-compose up`启动

### docker-compose常用命令

- `docker-compose up`: 启动容器

- `docker-compose up -d`: 后台运行容器

- `docker-compose ps`: 查看容器运行状态

- `docker-compose stop`: 停止所有容器

- `docker-compose stop [name]`: 停止某个容器

- `docker-compose rm [name]`: 删除容器
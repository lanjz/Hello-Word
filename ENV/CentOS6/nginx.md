### 通过yum安装 `yum -y install nginx`

### yum安装nginx时报错：No package nginx available. Error: Nothing to do

nginx的yum源包,直接安装一个nginx的yum源文件

```{r, engine='sh', count_lines}
rpm -ivh http://nginx.org/packages/centos/6/noarch/RPMS/nginx-release-centos-6-0.el6.ngx.noarch.rpm
Retrieving http://nginx.org/packages/centos/6/noarch/RPMS/nginx-release-centos-6-0.el6.ngx.noarch.rpm
```

### 查看nginx的安装目录

```sh
ps  -ef | grep nginx  
```

master process 后面的就是 nginx的目录。

### 查看nginx配置文件目录

~ nginx -t

### 启动nginx服务

```sh
~ service nginx start
Starting nginx:       
```

### 停止nginx服务

```sh
~ service nginx stop
Stopping nginx:       
```

### 重启nginx服务

```sh
~ service nginx restart
Stopping nginx:
Starting nginx:       
```

### nginx配置文件说明

https://www.w3cschool.cn/nginx/nginx-d1aw28wa.html

### 查看nginx 默认站点目录

`/usr/share/nginx/html`

https://segmentfault.com/a/1190000007116797 

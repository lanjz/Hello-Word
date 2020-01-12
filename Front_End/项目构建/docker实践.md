# Docker安装
 
Docker 是一个开源的商业产品，有两个版本：社区版（Community Edition，缩写为 CE）和企业版（Enterprise Edition，缩写为 EE）。
企业版包含了一些收费服务，个人开发者一般用不到。
 
Docker CE 的安装请参考官方文档。[Docker 安装](https://docs.docker.com/docker-for-mac/install/)

安装成功后，运行下面查看是否安装成功

```
docker version
或者
docker info
```

Docker是服务器--客户端架构。命令行运行`docker`命令的时候，需要本机有Docker服务。
如果这项服务没有启动，可以用下面的命令启动

```
# service 命令的用法
$ sudo service docker start

# systemctl 命令的用法
$ sudo systemctl start docker
```

# image文件

Docker 把应用程序及其依赖，打包在 image 文件里面。只有通过这个文件，才能生成 Docker 容器。
image 文件可以看作是容器的模板。Docker 根据 image 文件生成容器的实例。同一个 image 文件，可以生成多个同时运行的容器实例。

image 是二进制文件。实际开发中，一个 image 文件往往通过继承另一个 image 文件，
加上一些个性化设置而生成。举例来说，你可以在 Ubuntu 的 image 基础上，
往里面加入 Apache 服务器，形成你的 image。

```
# 列出本机的所有 image 文件。
$ docker image ls

# 删除 image 文件
$ docker image rm [imageName]
```

image 文件是通用的，一台机器的 image 文件拷贝到另一台机器，照样可以使用。

# 实例：Hello World

国内连接 Docker 的官方仓库很慢，所以需要将默认仓库改成国内的镜像网站,Mac下的步骤如下

Docker图标 => `preference` => `Daemon`  在`Registry mirrors`下添加源镜像地址

```
https://docker.mirrors.ustc.edu.cn
https://hub-mirror.c.163.com
```

## 从网上拉取image

首先，运行下面的命令，将 image 文件`hello-world `从仓库抓取到本地

```
docker image pull library/hello-world
```

上面代码中，`docker image pull`是抓取 image 文件的命令。
`library/hello-world`是 `image`文件在仓库里面的位置，其中`library`是 `image` 文件所在的组，
`hello-world`是 `image` 文件的名字。

由于Docker 官方提供的`image`文件，都放在`library`组里面，所以它的是默认组，可以省略。
因此，上面的命令可以写成下面这样。

```
docker image pull hello-world
```

抓取成功以后，就可以通过命令`docker image ls`  查看本机里的 image 文件了。

现在，运行这个 image 文件。

`docker container run [image]`命令会从 image 文件，生成一个正在运行的容器实例。

```
$ docker container run hello-world
Hello from Docker!
This message shows that your installation appears to be working correctly.

... ...
```

输出这段提示以后，`hello world`就会停止运行，容器自动终止。

有些容器不会自动终止，因为提供的是服务。比如，安装运行Node服务。

> 注意，docker container run命令具有自动抓取 image 文件的功能。如果发现本地没有指定的 image 文件，
>就会从仓库自动抓取。因此，前面的docker image pull命令并不是必需的步骤。

# 容器文件

image 文件生成的容器实例，本身也是一个文件，称为容器文件。也就是说，一旦容器生成，
就会同时存在两个文件： image 文件和容器文件。而且关闭容器并不会删除容器文件，
只是容器停止运行而已

```
# 列出本机正在运行的容器
$ docker container ls

# 列出本机所有容器，包括终止运行的容器
$ docker container ls --all
```
上面命令的输出结果之中，包括容器的 ID。很多地方都需要提供这个 ID，比如上一节终止容器运行的docker container kill命令。

终止运行的容器文件，依然会占据硬盘空间，可以使用`docker container rm命`令删除。

`docker container rm [containerID]`

运行上面的命令之后，再使用`docker container ls --all`命令，就会发现被删除的容器文件已经消失了。

# Dockerfile 文件

学会使用 image 文件以后，接下来的问题就是，如何可以生成 image 文件？
如果你要推广自己的软件，势必要自己制作 image 文件。

这就需要用到 Dockerfile 文件。它是一个文本文件，用来配置 image。Docker 根据 该文件生成二进制的 image 文件。

下面通过一个实例，演示如何编写 Dockerfile 文件。

# 实例：制作自己的Docker容器

新建一个简单的Node项目，介绍怎么写`Dockerfile`文件，实现在`Docker`容器里面运行Node项目。

新建一个`koa-demo`目录，并创建`app.js`内容如下

```
// app.js
const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Koa';
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});  
```

## 编写Dockerfile文件

Dockerfile是一个构建镜像的文本文件，文本包含了一条条构建镜像所需的指令和说明。

首先，在项目的根目录下，新建一个文本文件`.dockerignore`，写入下面的内容。

```
.git
node_modules
npm-debug.log
```

`.dockerignore`表示哪些文件不打包到`image`文件中，如果你没有路径要排除，这个文件可以不新建。

然后，在项目的根目录下，新建一个文本文件`Dockerfile`，写入下面的内容。

```
FROM node:8.4
COPY . /app
WORKDIR /app
RUN npm install --registry=https://registry.npm.taobao.org
EXPOSE 3000
```

上面代码一共五行，含义如下。

```
FROM node:8.4：该 image 文件继承官方的 node image，冒号表示标签，这里标签是8.4，即8.4版本的 node。
COPY . /app：将当前目录下的所有文件（除了.dockerignore排除的路径），都拷贝进入 image 文件的/app目录。
WORKDIR /app：指定接下来的工作路径为/app。
RUN npm install：在/app目录下，运行npm install命令安装依赖。注意，安装后所有的依赖，都将打包进入 image 文件。
EXPOSE 3000：将容器 3000 端口暴露出来， 允许外部连接这个端口。
10.2 创建 image 文件
```

## 创建 image 文件

有了 Dockerfile 文件以后，就可以使用`docker image build`命令创建image文件了。

```
$ docker image build -t koa-demo .
# 或者
$ docker image build -t koa-demo:0.0.1 .
```

上面代码中，`-t`参数用来指定image文件的名字，后面还可以用冒号指定标签。
如果不指定，默认的标签就是latest。最后的那个点表示 Dockerfile 文件所在的路径，
上例是当前路径，所以是一个点。

终端执行完，输出

```
...
Successfully built ...
Successfully tagged ...
```

说明运行成功，使用`docker image ls`命令就可以看到新生成的 image 文件`koa-demo`了。

## 生成容器

`docker container run`命令会从 image 文件生成容器。

```
$ docker container run -p 8000:3000 -it koa-demo /bin/bash
# 或者
$ docker container run -p 8000:3000 -it koa-demo:0.0.1 /bin/bash
```

上面命令的各个参数含义如下：

```
-p参数：容器的 3000 端口映射到本机的 8000 端口。
-it参数：容器的 Shell 映射到当前的 Shell，然后你在本机窗口输入的命令，就会传入容器。
koa-demo:0.0.1：image 文件的名字（如果有标签，还需要提供标签，默认是 latest 标签）。
/bin/bash：容器启动以后，内部第一个执行的命令。这里是启动 Bash，保证用户可以使用 Shell。
```

如果一切正常，运行上面的命令以后，就会返回一个命令行提示符。

```
root@4cab99d16e2e:/app#
```

这表示你已经在容器里面了，返回的提示符就是容器内部的 Shell 提示符。执行下面的命令。

```
root@4cab99d16e2e:/app#  node app.js
```

这时终端输出`Example app listening on port 3000!`，说明 Koa 框架已经运行起来了。
打开本机的浏览器，访问`http://localhost:8000/`，网页将显示"Koa"

- 关于生成容器的命令行中添加了`-p 8000:3000 `命令

  Node 进程运行在 Docker 容器的虚拟环境里面，进程接触到的文件系统和网络接口都是虚拟的，
  与本机的文件系统和网络接口是隔离的，因此需要定义容器与物理机的端口映射（map）
  
## 退出容器

在容器的命令行，按下 `Ctrl + c` 停止 Node 进程，然后按下 `Ctrl + d` （或者输入 `exit`）退出容器。

此外，也可以用`docker container kill`终止容器运行。

```
# 在本机的另一个终端窗口，查出容器的 ID
$ docker container ls

# 停止指定的容器运行
$ docker container kill [containerID]
```

容器停止运行之后，并不会消失，用下面的命令删除容器文件。

```
# 查出容器的 ID
$ docker container ls --all

# 删除指定的容器文件
$ docker container rm [containerID]
```

也可以使用`docker container run`命令的`--rm`参数，在容器终止运行后自动删除容器文件。

```
docker container run --rm -p 8000:3000 -it koa-demo /bin/bash
```

## CMD 命令

上一节的例子里面，容器启动以后，需要手动输入命令`node app.js`。我们可以把这个命令写在 Dockerfile 里面，
这样容器启动以后，这个命令就已经执行了，不用再手动输入了。

```
FROM node:8.4
COPY . /app
WORKDIR /app
RUN npm install --registry=https://registry.npm.taobao.org
EXPOSE 3000
CMD node app.js
```

上面的 Dockerfile 里面，多了最后一行CMD `node app.js`，它表示容器启动后自动执行`node app.js`

- RUN命令与CMD命令的区别在哪里

  简单说，RUN命令在 image 文件的构建阶段执行，执行结果都会打包进入 image 文件；
CMD命令则是在容器启动后执行。另外，一个 Dockerfile 可以包含多个RUN命令，但是只能有一个CMD命令。

注意，指定了CMD命令以后，`docker container run`命令就不能附加命令了（比如前面的`/bin/bash`），否则它会覆盖CMD命令。
现在，启动容器可以使用下面的命令。

在Dockerfile中添加`CMD`命令后，重新执行生成image `docker image build -t lanjz/koa-demo:0.0.1 .`

然后使用`docker container run --rm -p 8000:3000 -it lanjz/koa-demo:0.0.1`生成容器,提示`Example app listening on port 3000!`
说明Node服务开启成功

# 发布image文件

首先，去`hub.docker.com`或`cloud.docker.com`注册一个账户。然后，用下面的命令登录。

```
docker login
```

接着，为本地的 image 标注用户名和版本。

```
$ docker image tag [imageName] [username]/[repository]:[tag]
# 实例
$ docker image tag koa-demo lanjz/koa-demo:0.0.1
```

执行完后通过`docker image ls`可以看到是否刚添加`lanjz/koa-demo:0.0.1 `

也可以不标注用户名，重新构建一下 image 文件。

`docker image build -t [username]/[repository]:[tag] .
`
最后，发布 image 文件。

```
docker image push [username]/[repository]:[tag]
// 实例
docker image push lanjz/koa-demo:0.0.1
```
发布成功后，登录`hub.docker.com`就可以看到自己发布的image文件

![avatar](https://raw.githubusercontent.com/lanjz/Orchid/master/_static/images/1578805038072_screenshot-hub.docker.com-2020.01.12-12_56_51.png?token=AGLLJCJ7UNP3UMPA3RTLKS26DKTWY) 

如果提示`denied: requested access to the resource is denied`,这是因为
image设置的`username`与你登录的Docker账号不一致，改成一致就可以了

# Docker常用命令

- `docker image rmi [ IMAGE ID ||  REPOSITORY]`

  删除image，如果`rmi`后面使用的是`IMAGE ID`，且这个`IMAGE ID`被一个以上的`REPOSITORY`引用，则删除失败并会提示

  ```
  conflict: unable to delete a019cfbd90e3 (must be forced) - image is referenced in multiple repositories
  ```
  
  此时先使用`docker image rmi [REPOSITORY]` 删除引用的`REPOSITORY`,最后在使用`docker image rmi [IMAGE ID]`

- `docker container start [containerID] `

  前面的`docker container run`命令是新建容器，每运行一次，就会新建一个容器。同样的命令运行两次，就会生成两个一模一样的容器文件。
  如果希望重复使用容器，就要使用`docker container start`命令，它用来启动已经生成、已经停止运行的容器文件。
  
- `docker container stop [containerID]`  

  前面的`docker container kill`命令终止容器运行，相当于向容器里面的主进程发出`SIGKILL`信号。
而`docker container stop`命令也是用来终止容器运行，相当于向容器里面的主进程发出`SIGTERM`信号，
然后过一段时间再发出`SIGKILL`信号。

  这两个信号的差别是，应用程序收到`SIGTERM`信号以后，可以自行进行收尾清理工作，但也可以不理会这个信号。
如果收到`SIGKILL`信号，就会强行立即终止，那些正在进行中的操作会全部丢失。

- `docker container logs [containerID]`

  `docker container logs`命令用来查看`docker`容器的输出，即容器里面`Shell`的标准输出。
如果`docker run`命令运行容器的时候，没有使用`-it`参数，就要用这个命令查看输出。

- `$ docker container exec -it [containerID] /bin/bash` 

  `docker container exec`命令用于进入一个正在运行的`docker`容器。如果`docker run`命令运行容器的时候，
  没有使用`-it`参数，就要用这个命令进入容器。一旦进入了容器，就可以在容器的 `Shell` 执行命令了。

- `docker container cp [containID]:[/path/to/file] .`

  `docker container cp`命令用于从正在运行的 Docker 容器里面，将文件拷贝到本机。




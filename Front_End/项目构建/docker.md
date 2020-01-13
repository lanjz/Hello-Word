# Docker

> [Docker —— 从入门到实践](https://yeasy.gitbooks.io/docker_practice/basic_concept/image.html)

# 什么是Docker
 
Docker是指容器化技术，用于支持创建和使用Linux容器，Docker 属于 Linux 容器的一种封装，提供简单易用的容器使用接口。
它是目前最流行的 Linux 容器解决方案。

借助Docker,你可将容器当做轻巧，模块化的虚拟机使用。同时，你还将获得高度的灵活性，从而实现
对容器的高效创建，部署及复制，并能将其从一个环境顺利迁移至另一个环境

# 基本概念

Docker 包括三个基本概念

- 镜像（Image）

- 容器（Container）

- 仓库（Repository）

## 镜像（Image）

日常使用的操作系统分为内核和用户空间。对于 Linux 而言，内核启动后，会挂载 root 文件系统为其提供用户空间支持。
而 Docker 镜像（Image），就相当于是一个 root 文件系统。
比如官方镜像 ubuntu:18.04 就包含了完整的一套 Ubuntu 18.04 最小系统的 root 文件系统。

Docker 镜像是一个特殊的文件系统，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。
镜像不包含任何动态数据，其内容在构建之后也不会被改变

## 容器（Container）

镜像（Image）和容器（Container）的关系，就像是面向对象程序设计中的 类 和 实例 一样，镜像是静态的定义，容器是镜像运行时的实体。
容器可以被创建、启动、停止、删除、暂停等。
容器的实质是进程，但与直接在宿主执行的进程不同，容器进程运行于属于自己的独立的 命名空间。因此容器可以拥有自己的 root 文件系统、自己的网络配置、自己的进程空间，
甚至自己的用户 ID 空间。容器内的进程是运行在一个隔离的环境里，使用起来，就好像是在一个独立于宿主的系统下操作一样。
这种特性使得容器封装的应用比直接在宿主运行更加安全。也因为这种隔离的特性，很多人初学 Docker 时常常会混淆容器和虚拟机。

## 仓库（Registry）

镜像构建完成后，可以很容易的在当前宿主机上运行，但是，如果需要在其它服务器上使用这个镜像，我们就需要一个集中的存储、分发镜像的服务，`Docker Registry` 就是这样的服务。

简单来说就是一个云存储平台，可以存储Docker Image，我们可以让传自己的Image，也可以下载别人Image

一个 `Docker Registry` 中可以包含多个仓库（Repository）；每个仓库可以包含多个标签（Tag）；每个标签对应一个镜像。

仓库名经常以 两段式路径 形式出现`<username>/<Image>`，比如 `lanjz/koa-demo`，前者往往表示着 `Docker Registry` 的用户名，后者表示软件名。


# 镜像操作

从Docker镜像获取镜像的命令是`docker pull`. 其格式为：

`docker pull [选项] [Docker Registry 地址[:端口号]/]仓库名[:标签]`

- Docker 镜像仓库地址：地址的格式一般是 <域名/IP>[:端口号]。默认地址是 `Docker Hub`。

- 仓库名：如之前所说，这里的仓库名是两段式名称，即 `<用户名>/<镜像名>`。对于 Docker Hub，如果不给出用户名，则默认为 `library`，也就是官方镜像。

比如

```
docker image pull library/hello-world
```

上文的命令表示从Docker Hub下载名为`hello-world`的Image,`library`是这个Image所在的组，因为`library`是官方默认组，可以
省略，所以使用命令`docker image pull hello-world`也是一样的

`hello-world`后面没有带标签，则表示获取`last`标签

执行命令后将在终端出现以下信息

```
Using default tag: latest
latest: Pulling from library/hello-world
Digest: sha256:d1668a9a1f5b42ed3f46b70b9cb7c88fd8bdc8a2d73509bb0041cf436018fbf5
Status: Image is up to date for hello-world:latest
docker.io/library/hello-world:latest
```

抓取成功以后，就可以通过命令`docker image ls`  查看本机Docker里的 Image 文件了。

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

## docker commit

> [利用 commit 理解镜像构成](https://yeasy.gitbooks.io/docker_practice/image/commit.html)

正常我们的容器是通过Image生成的，但有时候我们希望直接修改容器内容，并保存为Image时就需要用到`docker commit`，

格式： `docker commit [选项] <容器ID或容器名> [<仓库名>[:<标签>]]`

```
$ docker commit \
    --author "Tao Wang <twang2218@gmail.com>" \
    --message "修改了默认网页" \
    webserver \
    nginx:v2
sha256:07e33465974800ce65751acc279adc6ed2dc5ed4e0838f8b86f0c87aa1795214
```

- `--author` 是指定修改的作者

- `--message` 则是记录本次修改的内容

### 慎用`docker commit`

使用 docker commit 意味着所有对镜像的操作都是黑箱操作，生成的镜像也被称为 黑箱镜像，换句话说，就是除了制作镜像的人知道执行过什么命令、怎么生成的镜像，别人根本无从得知。
而且，即使是这个制作镜像的人，过一段时间后也无法记清具体的操作。这种黑箱镜像的维护工作是非常痛苦的。

而且，回顾之前提及的镜像所使用的分层存储的概念，除当前层外，之前的每一层都是不会发生改变的，换句话说，任何修改的结果仅仅是在当前层进行标记、添加、修改，而不会改动上一层。
如果使用 docker commit 制作镜像，以及后期修改的话，每一次修改都会让镜像更加臃肿一次，所删除的上一层的东西并不会丢失，会一直如影随形的跟着这个镜像，即使根本无法访问到。这会让镜像更加臃肿。

## 使用 Dockerfile 定制镜像

镜像的定制实际上就是定制每一层所添加的配置、文件。如果我们可以把每一层修改、安装、构建、操作的命令都写入一个脚本，用这个脚本来构建、定制镜像，那么之前提及的无法重复的问题、镜像构建透明性的问题、体积的问题就都会解决。
这个脚本就是 Dockerfile。

Dockerfile 是一个文本文件，其内包含了一条条的 指令(Instruction)，**每一条指令构建一层，因此每一条指令的内容，就是描述该层应当如何构建。**

例子：

首先在项目的根目录下，新建一个文本文件`Dockerfile`，写入下面的内容。

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

## 构建构建上下文（Context）

回顾一下上文构建命令`docker image build -t koa-demo .`，最后一个` . `,它表示的**上下文环境**，说白了就是你要打包的项目的路径，
上面的例子中因为我们在项目根目录下创建 Dockerfile 文件，所以` . `刚好表示项目在当前目录下

如果在Dockerfile 文件中这么写：

```
COPY ./package.json /app/
```

这并不是要复制执行`docker build`所在的目录下的`package.json`，也不是复制 Dockerfile 所在目录下的 `package.json`,而是复制
** 上下文（context）**目录下的`package.json`

> 理解构建上下文对于镜像构建是很重要的，避免犯一些不应该的错误。比如在发现 COPY /opt/xxxx /app 不工作后，于是干脆将 Dockerfile 放到了硬盘根目录去构建，
结果发现 docker build 执行后，在发送一个几十 GB 的东西，极为缓慢而且很容易构建失败。那是因为这种做法是在让 docker build 打包整个硬盘，这显然是使用错误。

实际上 Dockerfile 的文件名并不要求必须为 Dockerfile，而且并不要求必须位于上下文目录中，比如可以用 `-f ../Dockerfile.php` 参数指定某个文件作为 Dockerfile

## 其它构建方法的用法

- 直接用 Git repo 进行构建

  或许你已经注意到了，docker build 还支持从 URL 构建，比如可以直接从 Git repo 中构建：
  
  ```
  docker build https://github.com/twang2218/gitlab-ce-zh.git#:11.1
  
  Sending build context to Docker daemon 2.048 kB
  Step 1 : FROM gitlab/gitlab-ce:11.1.0-ce.0
  11.1.0-ce.0: Pulling from gitlab/gitlab-ce
  aed15891ba52: Already exists
  773ae8583d14: Already exists
  ...
  ```

  这行命令指定了构建所需的`Git repo`，并且指定默认的 `master` 分支，构建目录为 `/11.1/`，然后 Docker 就会自己去 `git clone` 这个项目、切换到指定分支、并进入到指定目录后开始构建。


- 用给定的 tar 压缩包构建

  `$ docker build http://server/context.tar.gz`
  
  如果所给出的 URL 不是个 Git repo，而是个 tar 压缩包，那么 Docker 引擎会下载这个包，并自动解压缩，以其作为上下文，开始构建。
  
- 从标准输入中读取 Dockerfile 进行构建

  `docker build - < Dockerfile`或`cat Dockerfile | docker build -`
  
  如果标准输入传入的是文本文件，则将其视为 Dockerfile，并开始构建。这种形式由于直接从标准输入中读取 Dockerfile 的内容，它没有上下文，
  因此不可以像其他方法那样可以将本地文件 COPY 进镜像之类的事情。
  
- 从标准输入中读取上下文压缩包进行构建

  `docker build - < context.tar.gz`
  
  如果发现标准输入的文件格式是 gzip、bzip2 以及 xz 的话，将会使其为上下文压缩包，直接将其展开，将里面视为上下文，并开始构建。

# Dockerfile 指令详解

- `FROM` 指定基础镜像

  所谓定制镜像，那一定是以一个镜像为基础，在其上进行定制。就像我们之前运行了一个 `node` 镜像的容器，基础镜像是必须指定的。
  而 FROM 就是指定 基础镜像，因此一个 Dockerfile 中 `FROM` 是必备的指令，并且必须是第一条指令。
  
  在 Docker Hub 上有非常多的高质量的官方镜像，有可以直接拿来使用的服务类的镜像，如 `nginx`、`redis`、`mongo`、`mysql`、`httpd`、`php`、`tomcat` 等；
  也有一些方便开发、构建、运行各种语言应用的镜像，如 `node`、`openjdk`、`python`、`ruby`、`golang` 等。
  可以在其中寻找一个最符合我们最终目标的镜像为基础镜像进行定制。
  
  如果没有找到对应服务的镜像，官方镜像中还提供了一些更为基础的操作系统镜像，如 `ubuntu`、`debian`、`centos`、`fedora`、`alpine` 等，这些操作系统的软件库为我们提供了更广阔的扩展空间。
  
  除了选择现有镜像为基础镜像外，Docker 还存在一个特殊的镜像，名为 `scratch`。这个镜像是虚拟的概念，并不实际存在，它表示一个空白的镜像。
  
  ```
  FROM scratch
  ...
  ```
  
  如果你以 `scratch` 为基础镜像的话，意味着你不以任何镜像为基础，接下来所写的指令将作为镜像第一层开始存在。
  
- RUN 执行命令

  RUN 指令是用来执行命令行命令的。由于命令行的强大能力，RUN 指令在定制镜像时是最常用的指令之一。其格式有两种：
  
  - shell 格式：RUN <命令>，就像直接在命令行中输入的命令一样。刚才写的 Dockerfile 中的 RUN 指令就是这种格式。
  
  - exec 格式：RUN ["可执行文件", "参数1", "参数2"]，这更像是函数调用中的格式。
  
  如果要执行多个`RUN`命令，可通过`&`合并,下面这个不正确的写法
  
  ```
  FROM debian:stretch
  
  RUN apt-get update
  RUN apt-get install -y gcc libc6-dev make wget
  RUN wget -O redis.tar.gz "http://download.redis.io/releases/redis-5.0.3.tar.gz"
  RUN mkdir -p /usr/src/redis
  RUN tar -xzf redis.tar.gz -C /usr/src/redis --strip-components=1
  RUN make -C /usr/src/redis
  RUN make -C /usr/src/redis install
  ```
  
  之前说过，Dockerfile 中每一个指令都会建立一层，RUN 也不例外。每一个 RUN 的行为，
  就和刚才我们手工建立镜像的过程一样：新建立一层，在其上执行这些命令，执行结束后，commit 这一层的修改，构成新的镜像。
  
  而上面的这种写法，创建了 7 层镜像。这是完全没有意义的，而且很多运行时不需要的东西，都被装进了镜像里，比如编译环境、更新的软件包等等。
  结果就是产生非常臃肿、非常多层的镜像，不仅仅增加了构建部署的时间，也很容易出错。
  
  上面的 Dockerfile 正确的写法应该是这样：
  
   ```
   FROM debian:stretch
   
   RUN buildDeps='gcc libc6-dev make wget' \
       && apt-get update \
       && apt-get install -y $buildDeps \
       && wget -O redis.tar.gz "http://download.redis.io/releases/redis-5.0.3.tar.gz" \
       && mkdir -p /usr/src/redis \
       && tar -xzf redis.tar.gz -C /usr/src/redis --strip-components=1 \
       && make -C /usr/src/redis \
       && make -C /usr/src/redis install \
       && rm -rf /var/lib/apt/lists/* \
       && rm redis.tar.gz \
       && rm -r /usr/src/redis \
       && apt-get purge -y --auto-remove $buildDeps
   ```
  
  Dockerfile 支持 Shell 类的行尾添加 \ 的命令换行方式，以及行首 # 进行注释的格式。良好的格式，比如换行、缩进、注释等，会让维护、排障更为容易，这是一个比较好的习惯。
  
## COPY 复制文件

格式：

- `COPY [--chown=<user>:<group>] <源路径>... <目标路径>`

- `COPY [--chown=<user>:<group>] ["<源路径1>",... "<目标路径>"]`

COPY 指令将从构建上下文目录中 `<源路径>` 的`文件/目录`复制到新的一层的镜像内的 `<目标路径>` 位置。比如：

```
COPY . /app
// 将当前目录下的所有文件（除了.dockerignore排除的路径），都拷贝进入 image 文件的/app目录。
```

`<源路径>` 可以是多个，甚至可以是通配符，其通配符规则要满足 Go 的 [`filepath.Match`](https://golang.org/pkg/path/filepath/#Match) 规则，如：

```
COPY hom* /mydir/
COPY hom?.txt /mydir/
```

`<目标路径>` 可以是容器内的绝对路径，也可以是相对于工作目录的相对路径（工作目录可以用 WORKDIR 指令来指定）。
目标路径不需要事先创建，如果目录不存在会在复制文件前先行创建缺失目录。

## ADD 更高级的复制文件

`ADD` 指令和 `COPY` 的格式和性质基本一致。但是在 `COPY` 基础上增加了一些功能。

比如 `<源路径>` 可以是一个 `URL`，这种情况下，Docker 引擎会试图去下载这个链接的文件放到 `<目标路径>` 去。但需要注意以下几点：

- 下载后的文件权限自动设置为`600`，如果这并不是想要的权限，那么还需要增加额外的一层 `RUN` 进行权限调整

- 如果下载的是个压缩包，需要解压缩，也一样还需要额外的一层 `RUN` 指令进行解压缩,
 所以不如直接使用 RUN 指令，然后使用 wget 或者 curl 工具下载，处理权限、解压缩、然后清理无用文件更合理。

- 如果 `<源路径>` 为一个 `tar` 压缩文件的话，压缩格式为 `gzip`, `bzip2` 以及 `xz` 的情况下，`ADD` 指令将会自动解压缩这个压缩文件到 `<目标路径>` 去。
但在某些情况下，如果我们真的是希望复制个压缩文件进去，而不解压缩，这时就不可以使用 `ADD` 命令了。

- `ADD` 指令会令镜像构建缓存失效，从而可能会令镜像构建变得比较缓慢

> 在 Docker 官方的 `Dockerfile 最佳实践文档` 中要求，尽可能的使用 `COPY`，因为 `COPY` 的语义很明确，就是复制文件而已，
而 `ADD` 则包含了更复杂的功能，其行为也不一定很清晰。最适合使用`ADD` 的场合，就是所提及的需要自动解压缩的场合。


## CMD容器启动命令

`CMD` 指令的格式和 `RUN` 相似，也是两种格式：

- shell 格式：`CMD <命令>`

- exec 格式：`CMD ["可执行文件", "参数1", "参数2"...]`, 一般推荐使用 `exec` 格式，这类格式在解析时会被解析为 `JSON` 数组，因此一定要使用双引号 "，而不要使用单引号。

`CMD`指令是启动容器后要执行的命令。

> Docker 不是虚拟机，容器就是进程。既然是进程，那么在启动容器的时候，需要指定所运行的程序及参数。
CMD 指令就是用于指定默认的容器主进程的启动命令的。

### 前台执行和后台执行

Docker 不是虚拟机，容器中的应用都应该以前台执行，而不是像虚拟机、物理机里面那样，用 `systemd` 去启动后台服务，容器内没有后台服务的概念

有一个`CMD`命令：`CMD service nginx start`

但是这个命令并没有正确执行，因为这个段命令被理解成了`CMD [ "sh", "-c", "service nginx start"]`，
因此主进程实际上是`sh`。那么当 `service nginx start` 命令结束后，`sh` 也就结束了，`sh`作为主进程退出了，自然就会令容器退出。

正确的做法是直接执行 nginx 可执行文件，并且要求以前台形式运行。比如：

```
CMD ["nginx", "-g", "daemon off;"]
```

## ENTRYPOINT 入口点

`ENTRYPOINT` 的格式和 `RUN` 指令格式一样，分为 `exec` 格式和 `shell` 格式。

`ENTRYPOINT` 的目的和 `CMD` 一样，都是在指定容器启动程序及参数。
`ENTRYPOINT` 在运行时也可以替代，不过比 `CMD` 要略显繁琐，需要通过 `docker run` 的参数 `--entrypoint` 来指定。

当指定了 `ENTRYPOINT` 后`，CMD `的含义就发生了改变，不再是直接的运行其命令，而是将` CMD `的内容作为参数传给 `ENTRYPOINT` 指令，换句话说实际执行时，将变为：

```
<ENTRYPOINT> "<CMD>"
```

那么有了 `CMD` 后，为什么还要有 `ENTRYPOINT` 呢？这种 `<ENTRYPOINT> "<CMD>"` 有什么好处么？让我们来看几个场景。

场景二：应用运行前的准备工作

启动容器就是启动主进程，但有些时候，启动主进程前，需要一些准备工作。

比如 mysql 类的数据库，可能需要一些数据库配置、初始化的工作，这些工作要在最终的 mysql 服务器运行之前解决。

此外，可能希望避免使用 root 用户去启动服务，从而提高安全性，而在启动服务前还需要以 root 身份执行一些必要的准备工作，
最后切换到服务用户身份启动服务。或者除了服务外，其它命令依旧可以使用 root 身份执行，方便调试等。

这些准备工作是和容器 CMD 无关的，无论 CMD 为什么，都需要事先进行一个预处理的工作。这种情况下，可以写一个脚本，
然后放入 ENTRYPOINT 中去执行，而这个脚本会将接到的参数（也就是 <CMD>）作为命令，
在脚本最后执行。比如官方镜像 redis 中就是这么做的：

```
FROM alpine:3.4
...
RUN addgroup -S redis && adduser -S -G redis redis
...
ENTRYPOINT ["docker-entrypoint.sh"]

EXPOSE 6379
CMD [ "redis-server" ]
```

可以看到其中为了 redis 服务创建了 redis 用户，并在最后指定了 ENTRYPOINT 为 docker-entrypoint.sh 脚本

```
#!/bin/sh
...
# allow the container to be started with `--user`
if [ "$1" = 'redis-server' -a "$(id -u)" = '0' ]; then
    chown -R redis .
    exec su-exec redis "$0" "$@"
fi

exec "$@"
```

该脚本的内容就是根据 CMD 的内容来判断，如果是 redis-server 的话，则切换到 redis 用户身份启动服务器，否则依旧使用 root 身份执行。比如：

```
$ docker run -it redis id
uid=0(root) gid=0(root) groups=0(root)
```

## ENV 设置环境变量

格式有两种：

- `ENV <key> <value>`

- `ENV <key1>=<value1> <key2>=<value2>...`

例子：

```
ENV VERSION=1.0 DEBUG=on \
    NAME="Happy Feet"
```

在`RUN`中就可以使用`$VERSION`来访问环境变量

下列指令可以支持环境变量展开： `ADD`、`COPY`、`ENV`、`EXPOSE`、`FROM`、`LABEL`、`USER`、`WORKDIR`、`VOLUME`、`STOPSIGNAL`、`ONBUILD`、`RUN`。

## APG构建参数

格式：`ARG <参数名>[=<默认值>]`

构建参数和 ENV 的效果一样，都是设置环境变量。所不同的是，ARG 所设置的构建环境的环境变量，在将来容器运行时是不会存在这些环境变量的。
但是不要因此就使用 ARG 保存密码之类的信息，因为 docker history 还是可以看到所有值的。

Dockerfile 中的 ARG 指令是定义参数名称，以及定义其默认值。该默认值可以在构建命令 docker build 中用 --build-arg <参数名>=<值> 来覆盖。


## VOLUME定义匿名卷

格式为：

- `VOLUME ["<路径1>", "<路径2>"...]`

- `VOLUME <路径>`

之前我们说过，容器运行时应该尽量保持容器存储层不发生写操作，对于数据库类需要保存动态数据的应用，其数据库文件应该保存于卷(volume)中，后面的章节我们会进一步介绍 Docker 卷的概念。为了防止运行时用户忘记将动态文件所保存目录挂载为卷，在 Dockerfile 中，
我们可以事先指定某些目录挂载为匿名卷，这样在运行时如果用户不指定挂载，其应用也可以正常运行，不会向容器存储层写入大量数据。

```
VOLUME /data
```

这里的 `/data` 目录就会在运行时自动挂载为匿名卷，任何向 `/data` 中写入的信息都不会记录进容器存储层，
从而保证了容器存储层的无状态化。当然，运行时可以覆盖这个挂载设置。比如：

```
docker run -d -v mydata:/data xxxx
```

在这行命令中，就使用了 mydata 这个命名卷挂载到了 /data 这个位置，替代了 Dockerfile 中定义的匿名卷的挂载配置。

## EXPOSE 声明端口

格式： `EXPOSE <端口1> [<端口2>...]`。

EXPOSE 指令是声明运行时容器提供服务端口，这只是一个声明，在运行时并不会因为这个声明应用就会开启这个端口的服务。在 Dockerfile 中写入这样的声明有两个好处，
一个是帮助镜像使用者理解这个镜像服务的守护端口，以方便配置映射；另一个用处则是在运行时使用随机端口映射时，也就是 docker run -P 时，会自动随机映射 EXPOSE 的端口。

要将 EXPOSE 和在运行时使用 -p <宿主端口>:<容器端口> 区分开来。-p，是映射宿主端口和容器端口，换句话说，
就是将容器的对应端口服务公开给外界访问，而 EXPOSE 仅仅是声明容器打算使用什么端口而已，并不会自动在宿主进行端口映射。

## WORKDIR 指定工作目录

格式为`WORKDIR <工作目录路径>`

使用 WORKDIR 指令可以来指定工作目录（或者称为当前目录）

## USER 指定当前用户

格式： `USER <用户名>[:<用户组>`

`USER` 指令和 `WORKDIR` 相似，都是改变环境状态并影响以后的层。`WORKDIR` 是改变工作目录，
`USER` 则是改变之后层的执行 `RUN`, `CMD` 以及 `ENTRYPOINT` 这类命令的身份。


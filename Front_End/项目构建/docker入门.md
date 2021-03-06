# Docker

> [Docker —— 从入门到实践](https://yeasy.gitbooks.io/docker_practice/basic_concept/image.html)
 
Docker是指容器化技术，用于支持创建和使用Linux容器，Docker 属于 Linux 容器的一种封装，提供简单易用的容器使用接口。

借助Docker,你可将容器当做轻巧，模块化的虚拟机使用。同时，你还将获得高度的灵活性，从而实现对容器的高效创建，部署及复制，并能将其从一个环境顺利迁移至另一个环境

# 基本概念

Docker 包括三个基本概念

- 镜像（Image）

- 容器（Container）

- 仓库（Repository）

## 镜像（Image）

Docker 镜像是一个特殊的文件系统，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。
镜像不包含任何动态数据，其内容在构建之后也不会被改变

## 容器（Container）

镜像（Image）和容器（Container）的关系，就像是面向对象程序设计中的 类 和 实例 一样，镜像是静态的定义，容器是镜像运行时的实体。

容器的实质是进程，但与直接在宿主执行的进程不同，容器进程运行于属于自己的独立的 命名空间。因此容器可以拥有自己的 root 文件系统、自己的网络配置、自己的进程空间，甚至自己的用户 ID 空间。

容器内的进程是运行在一个隔离的环境里，使用起来，就好像是在一个独立于宿主的系统下操作一样。

## 仓库（Registry）

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

`docker commit`让我们可以直接修改容器内容，并保存为新的Image，

格式： `docker commit [选项] <容器ID或容器名> [<仓库名>[:<标签>]]`

```
$ docker commit \
    --author "Tao Wang <twang2218@gmail.com>" \
    --message "修改了默认网页" \
    webserver \
    nginx:v2
sha256:07e33465974800ce65751acc279adc6ed2dc5ed4e0838f8b86f0c87aa1795214
```
- `--author` 修改的作者

- `--message` 本次修改的内容

### 慎用`docker commit`

使用 `docker commit` 意味着所有对镜像的操作都是黑箱操作，生成的镜像也被称为黑箱镜像，换句话说，就是除了制作镜像的人知道执行过什么命令、怎么生成的镜像，别人根本无从得知。
而且，即使是这个制作镜像的人，过一段时间后也无法记清具体的操作。这种黑箱镜像的维护工作是非常痛苦的。

而且，回顾之前提及的镜像所使用的分层存储的概念，除当前层外，之前的每一层都是不会发生改变的，换句话说，任何修改的结果仅仅是在当前层进行标记、添加、修改，而不会改动上一层。
如果使用 `docker commit` 制作镜像，以及后期修改的话，每一次修改都会让镜像更加臃肿一次，所删除的上一层的东西并不会丢失，会一直如影随形的跟着这个镜像，即使根本无法访问到。这会让镜像更加臃肿。

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
上例是当前路径，所以是一个点`.`

终端执行完，输出

```
...
Successfully built ...
Successfully tagged ...
```

说明运行成功，使用`docker image ls`命令就可以看到新生成的 image 文件`koa-demo`了。

## 构建构建上下文（Context）

回顾一下上文构建命令`docker image build -t koa-demo .`，最后一个` . `,它表示的**上下文环境**，说白了就是你要相对于`Dockerfile`的项目的路径，
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

- 直接用 `Git repo` 进行构建

  `docker build` 还支持从 `URL` 构建，比如可以直接从` Git repo `中构建：
  
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


- 用给定的` tar ` 压缩包构建

  `$ docker build http://server/context.tar.gz`
  
  如果所给出的 `URL` 不是个 `Git repo`，而是个 `tar` 压缩包，那么 Docker 引擎会下载这个包，并自动解压缩，以其作为上下文，开始构建。
  
- 从标准输入中读取 Dockerfile 进行构建

  `docker build - < Dockerfile`或`cat Dockerfile | docker build -`
  
  如果标准输入传入的是文本文件，则将其视为 Dockerfile，并开始构建。这种形式由于直接从标准输入中读取 Dockerfile 的内容，它没有上下文，
  因此不可以像其他方法那样可以将本地文件 `COPY` 进镜像之类的事情。
  
- 从标准输入中读取上下文压缩包进行构建

  `docker build - < context.tar.gz`
  
  如果发现标准输入的文件格式是 `gzip`、`bzip2` 以及 `xz` 的话，将会使其为上下文压缩包，直接将其展开，将里面视为上下文，并开始构建。

# Dockerfile 指令详解

## `FROM` 指定基础镜像

  所谓定制镜像，那一定是以一个镜像为基础，在其上进行定制。就像我们之前运行了一个 `node` 镜像的容器，基础镜像是必须指定的。
  而 `FROM` 就是指定 基础镜像，因此一个 Dockerfile 中 `FROM` 是必备的指令，并且必须是第一条指令。
  
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
  
- `RUN` 执行命令

  `RUN` 指令是用来执行命令行命令的。由于命令行的强大能力，`RUN` 指令在定制镜像时是最常用的指令之一。其格式有两种：
  
  - shell 格式：`RUN <命令>`，就像直接在命令行中输入的命令一样。比文写的`RUN npm install`。
  
  - exec 格式：RUN ["可执行文件", "参数1", "参数2"]，这更像是函数调用中的格式,上文应对写法为`RUN ["NPM,"install"]`。
  
  如果要执行多个`RUN`命令，可通过`&`合并,但要注意下面这种写法
  
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
  
  之间说过 Dockerfile 中每一个指令都会建立一层。 `RUN` 也不例外。
  每一个 RUN 的行为就如同我们手工建立镜像的过程一样：新建立一层，在其上执行这些命令，执行结束后，`commit` 这一层的修改，构成新的镜像。
  
  而上面的这种写法，创建了 7 层镜像。而且很多运行时不需要的东西，都被装进了镜像里，比如编译环境、更新的软件包等等。
  这样就会产生非常臃肿、非常多层的镜像，不仅仅增加了构建部署的时间，也很容易出错。
  
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
  
  > Dockerfile 支持 Shell 类的行尾添加` \ `的命令换行方式，以及行首` # `进行注释的格式
  
## COPY 复制文件

COPY 指令将从构建上下文目录中 `<源路径>` 的`文件/目录`复制到新的一层的镜像内的 `<目标路径>` 位置。比如：

- 格式：

  - `COPY [--chown=<user>:<group>] <源路径>... <目标路径>`

  - `COPY [--chown=<user>:<group>] ["<源路径1>",... "<目标路径>"]`

  ```
  COPY . /app
  // 将当前目录下的所有文件（除了.dockerignore排除的路径），都拷贝进入 Image 的/app目录。
  ```

- `<源路径>`： 可以是多个，甚至可以是通配符，其通配符规则要满足 Go 的 [`filepath.Match`](https://golang.org/pkg/path/filepath/#Match) 规则，如：

    ```
    COPY hom* /mydir/
    COPY hom?.txt /mydir/
    ```

- `<目标路径>`： 可以是容器内的绝对路径，也可以是相对于工作目录的相对路径（工作目录可以用 `WORKDIR` 指令来指定）。目标路径不需要事先创建，如果目录不存在会在复制文件前先行创建缺失目录。

## ADD更高级的复制文件

`ADD` 指令和 `COPY` 的格式和性质基本一致。但是在 `COPY` 基础上增加了一些功能。

比如 `<源路径>` 可以是一个 `URL`，这种情况下，Docker 引擎会试图去下载这个链接的文件放到 `<目标路径>` 去。但需要注意以下几点：

- 下载后的文件权限自动设置为`600`，如果这并不是想要的权限，那么还需要增加额外的一层 `RUN` 进行权限调整

- 如果下载的是个压缩包，需要解压缩，也一样还需要额外的一层 `RUN` 指令进行解压缩,所以不如直接使用 `RUN` 指令，然后使用 `wget` 或者 `curl` 工具下载，处理权限、解压缩、然后清理无用文件更合理。

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

> Docker 不是虚拟机，容器就是进程。既然是进程，那么在启动容器的时候，需要指定所运行的程序及参数。`CMD` 指令就是用于指定默认的容器主进程的启动命令的。

### 前台执行和后台执行

Docker 不是虚拟机，容器中的应用都应该以前台执行，而不是像虚拟机、物理机里面那样，用 `systemd` 去启动后台服务，容器内没有后台服务的概念

假设我们希望容器启动后开启`nginx`服务,正常我们启动命令是`service nginx start`，所以我们就容易添加了如下这么一行CMD命令：

```
CMD service nginx start
```

但是这个命令并没有正确执行，~~因为`service nginx start`这段命令以后台守护进程形式启动 `nginx` 服务~~,因为此时的主进程实际上是`sh`
这段`CMD`指令实际上被理解成了`CMD [ "sh", "-c", "service nginx start"]`，
。那么当 `service nginx start` 命令结束后，`sh` 也就结束了，`sh`作为主进程退出了，自然就会令容器退出。

正确的做法是直接执行 `nginx` 可执行文件，并且要求以`exec`形式运行。比如：

```
CMD ["nginx", "-g", "daemon off;"]
```

## ENTRYPOINT 入口点

`ENTRYPOINT` 的格式和 `RUN` 指令格式一样，分为 `exec` 格式和 `shell` 格式。

`ENTRYPOINT` 的目的和 `CMD` 一样，都是在指定容器启动程序及参数。
`ENTRYPOINT` 在运行时也可以替代，通过 `docker run` 的参数 `--entrypoint` 来指定。

当指定了 `ENTRYPOINT` 后`，CMD `的含义就发生了改变，不再是直接的运行其命令，而是将` CMD `的内容作为参数传给 `ENTRYPOINT` 指令，换句话说实际执行时，将变为：

```
<ENTRYPOINT> "<CMD>"
```

那么有了 `CMD` 后，为什么还要有 `ENTRYPOINT` 呢？这种 `<ENTRYPOINT> "<CMD>"` 有什么好处么？让我们来看几个场景。

场景一：让镜像变成像命令一样使用

假如我们的`CMD`命令是个`curl`请求

```
CMD [ "curl", "-s", "https://ip.cn" ]
```

我们使用 `docker build -t myip .` 来构建镜像，我们需要查询当前公网 `IP`，只需要执行：

```
$ docker run myip
当前 IP：61.148.226.66 来自：北京市 联通
```

这样是OK的，但是如果我希望给这个添加参数呢，如果希望显示 `HTTP` 头信息，就需要加上 `-i` 参数

```
$ docker run myip -i
docker: Error response from daemon: invalid header field value "oci runtime error: container_linux.go:247: starting container process caused \"exec: \\\"-i\\\": executable file not found in $PATH\"\n".
```

我们可以看到可执行文件找不到的报错，`executable file not found`。因为跟在镜像名后面的是 `command`，运行时会替换 `CMD` 的默认值。
因此这里的 `-i` 替换了原来的 `CMD`，而不是添加在原来的 `curl -s https://ip.cn` 后面。而 `-i` 根本不是命令，所以自然找不到。

那么如果我们希望加入 `-i` 这参数，我们就必须重新完整的输入这个命令：

```
$ docker run myip curl -s https://ip.cn -i
```

这显然不是很好的解决方案，而使用 `ENTRYPOINT` 就可以解决这个问题。现在我们重新用 `ENTRYPOINT` 来实现这个镜像：

```
FROM ubuntu:18.04
RUN apt-get update \
    && apt-get install -y curl \
    && rm -rf /var/lib/apt/lists/*
ENTRYPOINT [ "curl", "-s", "https://ip.cn" ]
```

这次我们再来尝试直接使用 `docker run myip -i`：

```
$ docker run myip
当前 IP：61.148.226.66 来自：北京市 联通

$ docker run myip -i
HTTP/1.1 200 OK
Server: nginx/1.8.0
Date: Tue, 22 Nov 2016 05:12:40 GMT
Content-Type: text/html; charset=UTF-8
Vary: Accept-Encoding
X-Powered-By: PHP/5.6.24-1~dotdeb+7.1
X-Cache: MISS from cache-2
X-Cache-Lookup: MISS from cache-2:80
X-Cache: MISS from proxy-2_6
Transfer-Encoding: chunked
Via: 1.1 cache-2:80, 1.1 proxy-2_6:8006
Connection: keep-alive

当前 IP：61.148.226.66 来自：北京市 联通
```

可以看到，这次成功了。这是因为当存在` ENTRYPOINT `后，`CMD` 的内容将会作为参数传给` ENTRYPOINT`，而这里` -i` 就是新的 `CMD`，因此会作为参数传给 `curl`，从而达到了我们预期的效果。

场景二：应用运行前的准备工作

启动容器就是启动主进程，但有些时候，启动主进程前，需要一些准备工作。

比如 `mysql` 类的数据库，可能需要一些数据库配置、初始化的工作，这些工作要在最终的 `mysql` 服务器运行之前解决。

此外，可能希望避免使用 `root` 用户去启动服务，从而提高安全性，而在启动服务前还需要以 `root` 身份执行一些必要的准备工作，
最后切换到服务用户身份启动服务。或者除了服务外，其它命令依旧可以使用` root `身份执行，方便调试等。

这些准备工作是和容器 `CMD` 无关的。针对这种情况下，可以写一个脚本，
然后放入 `ENTRYPOINT` 中去执行，而这个脚本会将接到的参数（也就是 `<CMD>`作为命令，在脚本最后执行。比如官方镜像 `redis` 中就是这么做的：

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

该脚本的内容就是根据 `CMD` 的内容来判断，如果是 `redis-server` 的话，则切换到 redis 用户身份启动服务器，否则依旧使用 root 身份执行。比如：

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

构建参数和 `ENV` 的效果一样，都是设置环境变量。所不同的是，`ARG` 所设置的构建环境的环境变量，在将来容器运行时是不会存在这些环境变量的。
但是不要因此就使用 `ARG` 保存密码之类的信息，因为 `docker history` 还是可以看到所有值的。

Dockerfile 中的 `ARG` 指令是定义参数名称，以及定义其默认值。该默认值可以在构建命令 `docker build` 中用 `--build-arg <参数名>=<值>` 来覆盖。


## VOLUME定义匿名卷

格式为：

- `VOLUME ["<路径1>", "<路径2>"...]`

- `VOLUME <路径>`

之前我们说过，容器运行时应该尽量保持容器存储层不发生写操作，对于数据库类需要保存动态数据的应用，其数据库文件应该保存于卷`(volume)`中
。为了防止运行时用户忘记将动态文件所保存目录挂载为卷，在 Dockerfile 中，
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

`EXPOSE` 指令是声明运行时容器提供服务端口，这只是一个声明，在运行时并不会因为这个声明应用就会开启这个端口的服务。在 Dockerfile 中写入这样的声明有两个好处，
一个是帮助镜像使用者理解这个镜像服务的守护端口，以方便配置映射；另一个用处则是在运行时使用随机端口映射时，也就是 `docker run -P` 时，会自动随机映射 `EXPOSE` 的端口。

要将 `EXPOSE` 和在运行时使用 `-p <宿主端口>:<容器端口>` 区分开来。`-p`，是映射宿主端口和容器端口，换句话说，
就是将容器的对应端口服务公开给外界访问，而 `EXPOSE` 仅仅是声明容器打算使用什么端口而已，并不会自动在宿主进行端口映射。

## WORKDIR 指定工作目录

格式为`WORKDIR <工作目录路径>`

使用 `WORKDIR` 指令可以来指定工作目录（或者称为当前目录）

## USER 指定当前用户

格式： `USER <用户名>[:<用户组>`

`USER` 指令和 `WORKDIR` 相似，都是改变环境状态并影响以后的层。`WORKDIR` 是改变工作目录，
`USER` 则是改变之后层的执行 `RUN`, `CMD` 以及 `ENTRYPOINT` 这类命令的身份。

## HEALTHCHECK 健康检查

- `HEALTHCHECK [选项] CMD <命令>`：设置检查容器健康状况的命令

- `HEALTHCHECK NONE`：如果基础镜像有健康检查指令，使用这行可以屏蔽掉其健康检查指令

略

## ONBUILD 为他人做嫁衣裳

格式：`ONBUILD <其它指令>`。

`ONBUILD` 是一个特殊的指令，它后面跟的是其它指令，比如 `RUN`, `COPY` 等，而这些指令，在当前镜像构建时并不会被执行。只有当以当前镜像为基础镜像，去构建下一级镜像的时候才会被执行。


# 操作Docker容器

容器是 Docker 又一核心概念。

简单的说，容器是独立运行的一个或一组应用，以及它们的运行态环境。对应的，虚拟机可以理解为模拟运行的一整套操作系统（提供了运行态环境和其他系统环境）和跑在上面的应用。

## 启动容器常用操作

- `docker run `: 创建容器

  命令可以跟上参数

    - `-t`: 让Docker分配一个伪终端（pseudo-tty）并绑定到容器的标准输入上
    
    - `-i`: 容器的标准输入保持打开
    
    - `-d`: 需要让 Docker 在后台运行而不是直接把执行命令的结果输出在当前宿主机下，使用这个参数启动后会返回一个唯一的 `i`
      如果想到查看输出结果可以使用命令`docker logs`查看
  
  下面的命令则启动一个 bash 终端，允许用户进行交互

    ```
    docker run -t -i ubuntu:18.04 /bin/bash
    root@af8bae53bdd3:/#
    ```
    **进入后使用退出方式：`Ctrl-D`或`exit`**

  当利用 `docker run`来创建容器时，Docker 在后台运行的标准操作包括

  - 检查本地是否存在指定的镜像，不存在就从公有仓库下载

  - 利用镜像创建并启动一个容器

  - 分配一个文件系统，并在只读的镜像层外面挂载一层可读写层

  - 从宿主主机配置的网桥接口中桥接一个虚拟接口到容器中去

  - 从地址池配置一个 ip 地址给容器

  - 执行用户指定的应用程序

  - 执行完毕后容器被终止
  
- `docker container ls`: 列出正在运行的容器

- `docker container ls --all`: 列出所有容器，包括终止的容器

- `docker container start <id>`: 启动已终止容器

- `docker container stop <id>`: 终止容器

- `docker container rm`：删除容器

- `docker rm $(docker ps -aq)`: 删除所有容器

  ```
  $ docker container rm  trusting_newton
  trusting_newton
  ```
  
  如果要删除一个运行中的容器，可以添加 `-f` 参数。Docker 会发送 SIGKILL 信号给容器。
  
- `docker container prune`: 清理所有处于终止状态的容器

- `docker container logs [containerID]`

  `docker container logs`命令用来查看`docker`容器的输出，即容器里面`Shell`的标准输出。
如果`docker run`命令运行容器的时候，没有使用`-it`参数，就要用这个命令查看输出。

- `$ docker container exec -it [containerID] /bin/bash` 

  `docker container exec`命令用于进入一个正在运行的`docker`容器。如果`docker run`命令运行容器的时候，
  没有使用`-it`参数，就要用这个命令进入容器。一旦进入了容器，就可以在容器的 `Shell` 执行命令了。

- `docker container cp [containID]:[/path/to/file] .`

  `docker container cp`命令用于从正在运行的 Docker 容器里面，将文件拷贝到本机。

## 进入容器

在使用 `-d` 参数时，容器启动后会进入后台。

某些时候需要进入容器进行操作，包括使用 `docker attach` 命令或 `docker exec 命令`，他们的区别如下：

- `attach`: 如`docker attach 243c`,如果在窗口内`exit`,会导致容器的停止

- `exec`:如`docker exec -i 69d1 bash`,如果在窗口内`exit`,不会导致容器的停止

因此推荐大家使用 `docker exec`

## 复制容器内的文件到本机

`sudo docker cp 484:/etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf`

复制 `id 为484`容器内的`/etc/nginx/conf.d/default.conf`文件到本机的`/etc/nginx/conf.d/default.conf`

## 导入和导出

可以使用`docker export`命令导出容器快照到本地文件

```
$ docker container ls -a
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                    PORTS               NAMES
7691a814370e        ubuntu:18.04        "/bin/bash"         36 hours ago        Exited (0) 21 hours ago                       test
$ docker export 7691a814370e > ubuntu.tar
```

可以使用 `docker import` 从容器快照文件中再导入为镜像

```
$ cat ubuntu.tar | docker import - test/ubuntu:v1.0
$ docker image ls
REPOSITORY          TAG                 IMAGE ID            CREATED              VIRTUAL SIZE
test/ubuntu         v1.0                9d37a6082e97        About a minute ago   171.3 MB
```

此外，也可以通过指定 URL 或者某个目录来导入，例如

```
docker import http://example.com/exampleimage.tgz example/imagerepo
```

> 用户既可以使用 docker load 来导入镜像存储文件到本地镜像库，也可以使用 docker import 来导入一个容器快照到本地镜像库。
这两者的区别在于容器快照文件将丢弃所有的历史记录和元数据信息（即仅保存容器当时的快照状态），而镜像存储文件将保存完整记录，体积也要大。
此外，从容器快照文件导入时可以重新指定标签等元数据信息。

# 推送自己的镜像

使用`docker login`登录自己的账号

通过 `docker push` 命令来将自己的镜像推送到 Docker Hub

```
docker tag ubuntu:18.04 username/ubuntu:18.04
```

通过`docker search <username>`查找官方仓库中的镜像

## 自动构建

自动构建（Automated Builds）功能对于需要经常升级镜像内程序来说，十分方便。

有时候，用户构建了镜像，安装了某个软件，当软件发布新版本则需要手动更新镜像。

而自动构建允许用户通过 Docker Hub 指定跟踪一个目标网站（支持 GitHub 或 BitBucket）上的项目，一旦项目发生新的提交 （commit）或者创建了新的标签（tag），
Docker Hub 会自动构建镜像并推送到 Docker Hub 中。

要配置自动构建，包括如下的步骤：

- 登录 Docker Hub；

- 在 Docker Hub 点击右上角头像，在账号设置（Account Settings）中关联（Linked Accounts）目标网站；

- 在 Docker Hub 中新建或选择已有的仓库，在 Builds 选项卡中选择 Configure Automated Builds

- 选取一个目标网站中的项目（需要含 Dockerfile）和分支

- 指定 Dockerfile 的位置，并保存

之后，可以在 Docker Hub 的仓库页面的 Timeline 选项卡中查看每次构建的状态

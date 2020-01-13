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

我们都知道，操作系统分为内核和用户空间。对于 Linux 而言，内核启动后，会挂载 root 文件系统为其提供用户空间支持。
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

镜像构建完成后，可以很容易的在当前宿主机上运行，但是，如果需要在其它服务器上使用这个镜像，我们就需要一个集中的存储、分发镜像的服务，Docker Registry 就是这样的服务。

一个 Docker Registry 中可以包含多个仓库（Repository）；每个仓库可以包含多个标签（Tag）；每个标签对应一个镜像。

通常，一个仓库会包含同一个软件不同版本的镜像，而标签就常用于对应该软件的各个版本。
我们可以通过 <仓库名>:<标签> 的格式来指定具体是这个软件哪个版本的镜像。如果不给出标签，将以 latest 作为默认标签。

以 Ubuntu 镜像 为例，ubuntu 是仓库的名字，其内包含有不同的版本标签，如，16.04, 18.04。
我们可以通过 ubuntu:16.04，或者 ubuntu:18.04 来具体指定所需哪个版本的镜像。
如果忽略了标签，比如 ubuntu，那将视为 ubuntu:latest。

仓库名经常以 两段式路径 形式出现，比如 `lanjz/koa-demo`，前者往往意味着 Docker Registry 的用户名，
后者表示软件名。但这并非绝对，取决于所使用的具体 Docker Registry 的软件或服务。


# 镜像操作

从Docker镜像获取镜像的命令是`docker pull`. 其格式为：

`docker pull [选项] [Docker Registry 地址[:端口号]/]仓库名[:标签]`

- Docker 镜像仓库地址：地址的格式一般是 <域名/IP>[:端口号]。默认地址是 Docker Hub。

- 仓库名：如之前所说，这里的仓库名是两段式名称，即 <用户名>/<软件名>。对于 Docker Hub，如果不给出用户名，则默认为 library，也就是官方镜像。

比如

```
docker image pull library/hello-world
```

上文的命令表示从Docker Hub下载`hello-world`Image,`library`是这个Image所在的组，因为`library`是默认组，可以
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

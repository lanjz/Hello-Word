`export GO111MODULE=on`

## go mod init 失败

提未错误：

```
go: cannot determine module path for source directory
```
那是因为`go mod init没加项目名

`go mod init 项目名`

## 设置安装装的代理

当安装包的时候，可能会下载失败，出现错误：

```
unrecognized import path "golang.org/x/text"
```

解决：

`export GOPROXY=https://goproxy.io`
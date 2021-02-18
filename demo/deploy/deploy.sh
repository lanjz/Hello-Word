#!/bin/bash
cd /usr1/AAA/mydemo
#删除原静态资源目录
rm -rf public
cd /usr1/AAA
#解压新的包
unzip public.zip
#将解压出的public目录移动到服务端程序目录BBB中
mv public ./mydemo
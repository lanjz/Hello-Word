# Mac 使用小记

## Shell 命令

**文件操作**

- 删除空目录: `rmdir 目录`

- 删除文件夹: `rm -rf 目录名字`

  - `-r` 就是向下递归，不管有多少级目录，一并删除

  - `-f` 就是直接强行删除，不作任何提示的意思

- 强制删除文件: `rm -f 文件名`

- 创建文件夹：`mkdir 文件夹名`

- 创建文件：`touch 文件`

- 称动文件：`mv 源文件 目标文件`

- 复制文件：`cp 源文件 目标文件`

## vim

### 移动光标

- 移动到行尾"$"，移动到行首"0"(数字)，移动到行首第一个字符处"^"

- 移动到段首"{"，移动到段尾"}"

- 移动到下一个词"w"，移动到上一个词"b"

- 移动到文档开始"gg"，移动到文档结束"G"

- 跳到第n行"ngg" 或 "nG" 或 ":n"

- 移动光标到屏幕顶端"H"，移动到屏幕中间"M"，移动到底部"L"

- 移动到上次编辑文件的位置 "`"

### 编辑操作

- 光标后插入"a", 行尾插入"A"

- 后插一行插入"o"，前插一行插入"O"

- 删除字符插入"s"， 删除正行插入"S"

- 光标前插入"i"，行首插入"I"

- 删除一行"dd"，删除后进入插入模式"cc"或者"S"

- 删除一个单词"dw"，删除一个单词进入插入模式"cw"

- 删除一个字符"x"或者"dl"，删除一个字符进入插入模式"s"或者"cl"

- 粘贴"p"，交换两个字符"xp"

- 交换两行"ddp"

- 复制"y"，复制一行"yy"

- 拷贝当前行 "yy"或者"Y"

- 撤销"u"，重做"ctrl + r"

- 删除到行尾可以使用"D"或"C"

- 删除当前字符 "x"

- " >>"缩进所有选择的代码

-  "<<" 反缩进所有选择的代码

- 合并两行" J"

- 若不想保存文件，而重新打开":e!"

- 若想打开新文件 ":e filename"，然后使用"ctrl + ^"进行文件切换

### vim的简单配置

```js
syntax enable           //语法高亮                     
set number              //显示行号
set cursorline          //突出显示当前行
set ruler               //打开状态栏标尺
set shiftwidth=4        //设定 << 和 >> 命令移动时的宽度为 4
set softtabstop=4       //使得按退格键时可以一次删掉 4 个空格
set tabstop=4           //设定 tab 长度为 4
```

## brewhome

**修改 `brew` 源**

```js
cd "$(brew --repo)" && git remote set-url origin https://git.coding.net/homebrew/homebrew.git

$ cd $home && brew update
```

**恢复官方源**

```js
cd "$(brew --repo)" && git remote set-url origin https://github.com/Homebrew/brew.git
```

- 查看安装的应用：`brew list`

- 删除应用：`brew uninstall nginx`

## My Mac Soft

### brew

- nvm

- mongodb

- go 

### nvm

- node

### npm 

- nrm

### nginx
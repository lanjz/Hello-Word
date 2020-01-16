# package.json

每个项目的根目录下面，一般都有一个`package.json`文件，定义了这个项目所需要的各种模块，以及项目的配置信息（比如名称、版本、许可证等元数据）

`package.json`文件可以手工编写，也可以使用`npm init`命令自动生成。

## scripts字段

`scripts`指定了运行脚本命令的`npm`命令行缩写

```
"scripts": {
    "preinstall": "echo here it comes!",
    "postinstall": "echo there it goes!",
    "start": "node index.js",
    "test": "tap test/*.js"
}
```

比如上面`scripts`字段指定了`npm run preinstall`、`npm run postinstall`、`npm run start`、`npm run test`时，所要执行的命令。

##　dependencies字段，devDependencies字段

`dependencies`字段指定了项目运行所依赖的模块

`devDependencies`指定项目开发所需要的模块

`npm install <模块名> --save`表示将该模块写入`dependencies`属性，`npm install <模块名>--save-dev`表示将该模块写入`devDependencies`属性

`yarn add <模块名>`安装模块时表示将该模块写入`dependencies`属性，带`yarn add <模块名> --dev/-D`表示将该模块写入`devDependencies`属性

```
{
  "devDependencies": {
    "browserify": "~13.0.0",
    "karma-browserify": "~5.0.1"
  }
}
```

对应的版本可以加上各种限定，主要有以下几种：

- 指定版本：比如`1.2.2`，遵循“大版本.次要版本.小版本”的格式规定，安装时只安装指定版本。

- 波浪号（tilde）+ 版本：比如`~1.2.2`，表示安装`1.2.x`的最新版本（不低于`1.2.2`），但是不安装`1.3.x`，也就是说安装时不改变大版本号和次要版本号。

- 插入号（caret）+ 版本：比如`ˆ1.2.2`，表示安装`1.x.x`的最新版本（不低于`1.2.2`），但是不安装`2.x.x`，也就是说安装时不改变大版本号。
需要注意的是，如果大版本号为0，则插入号的行为与波浪号相同，这是因为此时处于开发阶段，即使是次要版本号变动，也可能带来程序的不兼容。

- latest：安装最新版本。

## peerDependencies

有时，你的项目和所依赖的模块，都会同时依赖另一个模块，但是所依赖的版本不一样。比如，你的项目依赖A模块`和`B模块的1.0版，而A模块本身又依赖B模块的2.0版。

大多数情况下，这不构成问题，B模块的两个版本可以并存，同时运行。但是，有一种情况，会出现问题，就是这种依赖关系将暴露给用户。

最典型的场景就是插件，比如A模块是B模块的插件。用户安装的B模块是1.0版本，但是A插件只能和2.0版本的B模块一起使用。这时，用户要是将1.0版本的B的实例传给A，就会出现问题。
因此，需要一种机制，**在模板安装的时候提醒用户，如果A和B一起安装，那么B必须是2.0模块。**

`peerDependencies`字段，就是用来供插件指定其所需要的主工具的版本。

```
{
  "name": "chai-as-promised",
  "peerDependencies": {
    "chai": "1.x"
  }
}
```

上面代码指定，安装`chai-as-promised`模块时，主程序`chai`必须一起安装，而且`chai`的版本必须是1.x。如果你的项目指定的依赖是`chai`的2.0版本，就会报错。

注意，从`npm 3.0`版开始，`peerDependencies`不再会默认安装了。

## bin字段

`bin`项用来指定各个内部命令对应的可执行文件的位置。

```
"bin": {
  "someTool": "./bin/someTool.js"
}
```

上面代码指定，`someTool` 命令对应的可执行文件为 `bin` 子目录下的 `someTool.js`。`Npm`会寻找这个文件，在`node_modules/.bin/`目录下建立符号链接。
在上面的例子中，`someTool.js`会建立符号链接`npm_modules/.bin/someTool`。由于`node_modules/.bin/`目录会在运行时加入系统的`PATH`变量，
因此在运行`npm`时，就可以不带路径，直接通过命令来调用这些脚本。

因此，像下面这样的写法可以采用简写。

```
scripts: {  
  start: './node_modules/someTool/someTool.js build'
}

// 简写为

scripts: {  
  start: 'someTool build'
}
```

所有`node_modules/.bin/`目录下的命令，都可以用`npm run [命令]`的格式运行。在命令行下，键入`npm run`，然后按`tab`键，就会显示所有可以使用的命令。

## main字段

`main`字段指定了加载的入口文件，`require('moduleName')`就会加载这个文件。这个字段的默认值是模块根目录下面的`index.js`。

## config字段

`config`字段用于添加命令行的环境变量。

下面是一个`package.json`文件

```
{
  "name" : "foo",
  "config" : { "port" : "8080" },
  "scripts" : { "start" : "node server.js" }
}
```

然后，在`server.js`脚本就可以引用`config`字段的值。

```
http
  .createServer(...)
  .listen(process.env.npm_package_config_port)
```

用户执行`npm run start`命令时，这个脚本就可以得到值。

用户可以在命令行中改变这个值：`npm config set foo:port 80`

## browser字段

`browser`指定该模板供浏览器使用的版本。`Browserify`这样的浏览器打包工具，通过它就知道该打包那个文件。

```
"browser": {
  "tipso": "./node_modules/tipso/src/tipso.js"
},
```

## engines 字段

`engines`字段指明了该模块运行的平台，比如 `Node` 的某个版本或者浏览器。

```
{ "engines" : { "node" : ">=0.10.3 <0.12" } }
```

该字段也可以指定适用的`npm`版本。

```
{ "engines" : { "npm" : "~1.0.20" } }
```

## man字段

`man`用来指定当前模块的`man`文档的位置。

```
"man" :[ "./doc/calc.1" ]
```

## preferGlobal字段

`preferGlobal`的值是布尔值，表示当用户不将该模块安装为全局模块时（即不用`–global`参数），要不要显示警告，表示该模块的本意就是安装为全局模块。

## style字段

`style`指定供浏览器使用时，样式文件所在的位置。样式文件打包工具`parcelify`，通过它知道样式文件的打包位置。

```
"style": [
  "./node_modules/tipso/src/tipso.css"
]
```

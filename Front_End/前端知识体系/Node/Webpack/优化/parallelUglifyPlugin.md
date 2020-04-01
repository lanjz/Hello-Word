这货咋念？

parallel：/'pærəlel/

Uglify：/'ʌɡlɪfaɪ/

Plugin：/'plʌgin/

在使用Webpack时，我们常用到UglifyPlugin对代码进行压缩以达到减小文件体积的目的。但是在压缩JavaScript时，需要先将代码解析成用Object抽象表示AST语法树，再应用各种规则去解析和处理AST，所以导致这个过程计算量大，耗时非常多。

像之前提到的HappyPack，它将任务分到子进程去执行，子进程完成后再将结果发送给主线程。以此达到提高文件解析的效率。这里讲的ParallelUglifyPlugin的作用也是同理，ParallelUglifyPlugin会开启多个子进程，将对文件的压缩工作分配到多个子进程去完成，每个子进程通过UglifyJS去压缩去代码。并行压缩，所以能更快地完成对多个文件的压缩工作。

ParallelUgfilyPlugin的使用也是非常简单，将原来Webapck配置文件内置的UglifyJsPlugin去掉后，用ParallelUglityPlugin替换却可，相关代码发下：

在通过ParallelUglityPlugin()实例化时，支持以下参数：

- test：使用正则去匹配哪些文件需要被ParallerUglifyPlugin压缩，默认值是`/\.js$/`，也就是压缩所有的js文件。

- include：使用正则去命中需要被ParallerUglifyPlugin压缩的文件，默认为[]，

- exclude：使用正则不需要被ParallerUglifyPlugin压缩的文件，转为为[]，

- cacheDir：缓存压缩的结果 ，再次遇到一样的输入时直接从缓存中获取结果并返回。cacheDir用于配置缓存存放的目录。默认不会缓存，若想开启缓存，则设置一个目录路径。

- workCount：开户几个子进程去并发执行压缩。默认为当前运行的计算机的CPU核数减1

- sourceMap：是否输出Source Map，这会导致压缩过程变慢

- uglifyJS：用于压缩ES5代码时的配置，为Object类型，被原封不动传递给UglifyJs作为参数

- uglifyES：用于压缩ES6代码的配置，为Object类型，被原封不动传递给UglifyEs作为参数

其中，`test`、`include`、 `exclude`与配置Loaders时的思想和用法一样

UglifyES是UglifyJS的一个变种，用于专门压缩ES6代码，他们都出自一个项目，并不能同时使用。

接入ParallelUglifyPlugin后，项目需要安装新的依赖：

`npm i -D webapck-parallel-uglify-plugin`




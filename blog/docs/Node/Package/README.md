# Package管理

## NPM 命令

**查看模块包信息**

- `npm list`: 查看所有已安装的 npm 软件包（包括它们的依赖包）的最新版本

- `npm list -g`: 查看所有已安装的全局 npm 包

- `npm list -g --depth=0`: 仅获取顶层的软件包

  ```js
  ├── gitbook-cli@2.3.2
  ├── npm@6.13.4
  ├── nrm@1.2.1
  └── yarn@1.19.1
  ```

- `npm list -g yarn`: 可以通过指定名称来获取特定软件包的版本

  ```js
  └── yarn@1.19.1
  ```

- `npm view [package_name] version`: 查看软件包在 npm 仓库上最新的可用版本

- `npm view [package_name] versions`: 查看软件包在 npm 仓库上所有的以前的版本

**安装模块包**

- `npm install`: 根据 `package.json` 配置安装模块到 `node_modules`，并自动添加到在 `package.json` 文件中的 `dependencies` 列表下（在 npm 5 之前：必须手动指定 `--save`）

  当添加了 `-D` 或 `--save-dev` 标志时，则会将其安装为开发依赖项（会被添加到 `devDependencies` 列表）

  当投入生产环境时，如果输入 `npm install` 且该文件夹包含 `package.json` 文件时，则会安装它们(`devDependencies` 列表和 `dependencies` 列表)，因为 npm 会假定这是开发部署

  需要设置 `--production` 标志（`npm install --production`），以避免安装这些开发依赖项

- `npm install <packagename>`: 安装最新的可用版本并放入 `node_modules` 文件夹中，并且还会将相应的条目添加到当前文件夹中存在的 `package.json` 和 `package-lock.json` 文件中

- `npm install <package>@<version>`: 可以使用 `@` 语法来安装 npm 软件包的旧版本

  ```js
  npm install cowsay
  // 以上命令会安装 1.3.1 版本（在撰写本文时）

  // 使用以下命令可以安装 1.2.0 版本：
  npm install cowsay@1.2.0
  ```

- `npm update`: 更新已安装的模块版本，并且 `package-lock.json` 文件会被新版本填充，`package.json` 则保持不变

- `npm outdated {-g}`: 列出已安装模块与相应可使用的最新版本

  ```js
  npm outdated -g

  Package  Current  Wanted  Latest  Location
  npm       6.13.4  6.14.7  6.14.7  global
  yarn      1.19.1  1.22.4  1.22.4  global
  ```
  
## 语义版本控制

语义版本控制的概念很简单：所有的版本都有 3 个数字：`x.y.z`

- 第一个数字是主版本

- 第二个数字是次版本

- 第三个数字是补丁版本

当发布新的版本时，不仅仅是随心所欲地增加数字，还要遵循以下规则：

- 当进行不兼容的 API 更改时，则升级主版本

- 当以向后兼容的方式添加功能时，则升级次版本

- 当进行向后兼容的缺陷修复时，则升级补丁版本

npm 设置了一些规则，可用于在 package.json 文件中选择要将软件包更新到的版本（当运行 npm update 时）

这些规则的详情如下：

- `^` : 如果写入的是 `^0.13.0`，则当运行 `npm update` 时，会更新到补丁版本和次版本：即 `0.13.1`、`0.14.0`、依此类推

- `~`: 如果写入的是 `〜0.13.0`，则当运行 `npm update` 时，会更新到补丁版本：即 `0.13.1` 可以，但 `0.14.0` 不可
以

- `>`: 接受高于指定版本的任何版本

- `>=`: 接受等于或高于指定版本的任何版本

- `<=`: 接受等于或低于指定版本的任何版本

- `<`: 接受低于指定版本的任何版本

- `=`: 接受确切的版本

- `-`: 接受一定范围的版本。例如：`2.1.0 - 2.6.2`

- `||`: 组合集合。例如 `< 2.1 || > 2.6`

可以合并其中的一些符号，例如 `1.0.0 || >=1.1.0 <1.2.0`，即使用 `1.0.0` 或从 `1.1.0` 开始但低于 `1.2.0` 的版本

- 无符号: 仅接受指定的特定版本（例如 `1.2.1`）

- `latest`: 使用可用的最新版本

**卸载 npm 软件包**

- `npm uninstall <package-name>`: 卸载之前在本地安装

  如果使用 `-S` 或 `--save` 标志，则此操作还会移除 `package.json` 文件中的引用

  如果使用 `-D` 或 `--save-dev` 标志，则此操作还会移除 `package.json` 文件中的引用( `devDependencies`中)

  ```js
  npm uninstall -S <package-name>
  npm uninstall -D <package-name>
  ```

- `npm uninstall -g <package-name>`: 卸载已安装的全局模块

## package.json/package-lock.json

`package.json` 文件是项目的清单。 它可以做很多完全互不相关的事情。 例如，它是用于工具的配置中心。 它也是 `npm` 和 `yarn` 存储所有已安装软件包的名称和版本的地方

`package-lock.json` 旨在跟踪被安装的每个软件包的确切版本，以便产品可以以相同的方式被 100％ 复制（即使软件包的维护者更新了软件包）

当运行 `npm update` 时，`package-lock.json` 文件中的依赖的版本会被更新

## YARN 命令

- `yarn init`: 初始化一个新项目

**安装**

- `yarn or yarn install`: 安装 `package.json` 中的所有依赖

- `yarn add [模块] --dev`: 安装依赖并添加到 `devDependencies`

- `yarn add [模块] --peer`: 安装依赖并添加到 `peerDependencies`

- `yarn add [模块] --optional`: 安装依赖并添加到 `optionalDependencies`

- `yarn upgrade [package | package@tag | package@version | --scope @scope]... [--ignore-engines] [--pattern]`: 此命令更新指定版本的依赖将依赖项更新到 `package.json` 和 `yarn.lock`

- `yarn install --force`: 强制重新下载所有软件包

- `yarn install --production`: 仅安装生产依赖项

**移除**

- `yarn remove <package...>`: 移除模块
### 修改brew源

```
cd "$(brew --repo)" && git remote set-url origin https://git.coding.net/homebrew/homebrew.git

$ cd $home && brew update
```

### 恢复官方源

```
cd "$(brew --repo)" && git remote set-url origin https://github.com/Homebrew/brew.git
```

- 查看安装的应用：`brew list`

- 删除应用：`brew uninstall nginx`
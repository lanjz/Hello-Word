### 修改brew源

```
cd "$(brew --repo)" && git remote set-url origin https://git.coding.net/homebrew/homebrew.git

$ cd $home && brew update
```

### 恢复官方源

```
cd "$(brew --repo)" && git remote set-url origin https://github.com/Homebrew/brew.git
```

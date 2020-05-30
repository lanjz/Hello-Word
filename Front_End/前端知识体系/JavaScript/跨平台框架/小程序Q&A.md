## textarea的键盘BUG

有同学可能会遇到这个问题：show-confirm-bar='false'设置不生效，导致键盘还带有“完成”按钮，预期效果是没有“完成”button~

这个值如果要设置为true的话随便输入就可以了，但是如果是要设置false的话就需要设置变量或者留空：

```
show-confirm-bar='' 或者 show-confirm-bar='{{showConfirm}}'
```
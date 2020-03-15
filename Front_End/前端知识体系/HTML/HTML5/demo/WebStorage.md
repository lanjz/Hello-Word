# localstorage

`localstorage`允许将数据长期保留在计算机中，以键值对我形式进行存储

## 用法

- 设置值：`localStorage.setItem('myCat', 'Tom')`

- 读取值：`localStorage.getItem('myCat')`

- 移除值：`localStorage.removeItem('myCat')`

- 移除所有的 `localStorage` 项: `localStorage.clear()`

注意点：

- 只可访问当前源的本地空间的`localstorage`对象

- 存储的类型会自动转化为字符串类型

## 监听localStorage变化

通过重写localStorage的setItem方法实现监听`localStorage`的变化，思路如下：

- 新建一个事件，并且监这个事件

- 在`localStorage.setItem`方法中使用`window.dispatchEvent`触发事件

完整例子：

```
var orignalSetItem = localStorage.setItem;
    localStorage.setItem = function(key,newValue){
        var setItemEvent = new Event("setItemEvent");
        setItemEvent.newValue = newValue;
        window.dispatchEvent(setItemEvent);
        orignalSetItem.apply(this,arguments);
    }
    window.addEventListener("setItemEvent", function (e) {
        alert(e.newValue);
    });
    localStorage.setItem("name","wang");
    console.log(window.localStorage)
```

# sessionStorage

`sessionStorage`和`localstorage`类似，区别在于`sessionStorage`存在周期仅限于会话期间

## 用法

- 设置值：`sessionStorage.setItem('myCat', 'Tom')`

- 读取值：`sessionStorage.getItem('myCat')`

- 移除值：`sessionStorage.removeItem('myCat')`

- 移除所有的 `sessionStorage` 项: `sessionStorage.clear()`
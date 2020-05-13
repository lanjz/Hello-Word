[路径匹配组件](https://www.cnblogs.com/cckui/p/11490372.html)

## Router

`Route` 用来控制路径对应显示的组件

```
<Route path='/about' exact component={Login}></Route>
<Route path='/about/:id' exact component={Home}></Route>
```

它有以下参数

- `path`：指定路由跳转路径

- `exact`: 精确匹配路由

  上面的例子如果没有`exact`属性，当访问`/about/1`时，匹配到的是`Login`组件

- `component`: 路由对应的组件

## Switch

```
<BrowserRouter>
    <Route path='/' exact component={Home}></Route>
    <Route path='/about' exact component={Login}></Route>
    <Route path='/detail/:id' exact component={Detail}></Route>
    <Route path='/about' exact component={Home}></Route>
</BrowserRouter>
```

上面有两个`/about`路由，当访问`/about`路径时，显示的将是`Home`组件即下面那个，因为默认下匹配路径会把所有路由都比较一遍

如果希望匹配到不继续往下匹配，就需要使用`Switch`组件

```
imoprt { Switch } from 'react-router-dom'
<BrowserRouter>
    <Route path='/' exact component={Home}></Route>
    <Route path='/about' exact component={Login}></Route>
    <Route path='/detail/:id' exact component={Detail}></Route>
    <Route path='/about' exact component={Home}></Route>
</BrowserRouter>
```


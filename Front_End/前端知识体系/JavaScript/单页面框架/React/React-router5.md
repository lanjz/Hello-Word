[路径匹配组件](https://www.cnblogs.com/cckui/p/11490372.html)

# 路由组件

## Router

`Route` 用来控制路径对应显示的组件

```
<Route path='/about' exact component={Login}></Route>
<Route path='/about/:id' exact component={Home}></Route>
```

它有以下参数

- `path`：指定路由跳转路径

- `exact`: 精确匹配路由

  上面的例子如果没有`exact`属性，当访问`/about/1`时,`Login`和`Home`组件都会渲染

- `component`: 路由对应的组件

- `render`: 通过写render函数返回具体的dom

  `<Route path='/about' exact render={() => (<div>about</div>)}></Route>`
  
  `render` 也可以直接返回 组件
  
  `<Route path='/about' exact render={() => <About /> }></Route>`
  
  **使用`render`的好处是不仅可以传递 `props` 属性还可以传递自定义属性**
  
  ```
  <Route path='/about' exact render={(props) => {
      return <About {...props} name={'cedric'} />
  }}></Route>
  ```
  `render` 方法也可用来进行权限认证：
  ```
  <Route path='/user' exact render={(props) => {
      // isLogin 从 redux 中拿到, 判断用户是否登录
      return isLogin ? <User {...props} name={'cedric'} /> : <div>请先登录</div>
  }}></Route>
  ```
  
- `sensitive`：是否区分路由大小写

- `strict`: 是否配置路由后面的 '/'

- `location`x`: 将 与当前历史记录位置以外的位置相匹配，则此功能在路由过渡动效中非常有用

  

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

## Link

`Link` 都可以用来指定路由跳转,它有两种使用方式：

- 通过字符串执行跳转路由

  ```
  <Link to='/login'>
      <span>登录</span>
  </Link>
  ```
  
- 通过对象指定跳转路由

  ```
  <Link to={{
          pathname: '/login',
          search: '?name=cedric',
          hash: '#someHash',
          state: { fromWechat: true }
      }}>
      <span>登录</span>
  </Link>
  ```
  - `pathname`: 表示要链接到的路径的字符串
  
  - `search`: 表示查询参数的字符串形式
  
  - `hash`: 放入网址的 `hash`，例如 `#a-hash`
  
  - `state`: 状态持续到 `location`.通常用于隐式传参（埋点），可以用来统计页面来源.组件中通过`this.props.location.state`获取

## NavLink

可以看做一个特殊版本的 Link，当它与当前 URL 匹配时，为其渲染元素添加样式属性

```
<Link to='/login' activeClassName="selected">
    <span>登录</span>
</Link>
---------------------------------------------
<NavLink
  to="/login"
  activeStyle={{
    fontWeight: 'bold',
    color: 'red'
   }}
>
    <span>登录</span>
</NavLink>
```

- `exact`: 如果为 `true`，则仅在位置完全匹配时才应用 `active 的类/样式`

- `strict`: 当为 `true`，要考虑位置是否匹配当前的URL时，`pathname` 尾部的斜线要考虑在内

- `location` 接收一个`location`对象，当`url`满足这个对象的条件才会跳转

- `isActive`: 接收一个回调函数，只有当 `active` 状态变化时才能触发，如果返回false则跳转失败

```
const oddEvent = (match, location) => {
  if (!match) {
    return false
  }
  const eventID = parseInt(match.params.eventID)
  return !isNaN(eventID) && eventID % 2 === 1
}

<NavLink
  to="/login"
  isActive={oddEvent}
>login</NavLink>
```

## Redirect

`Redirect` 将导航到一个新的地址。即重定向

```
<Switch> 
    <Route path='/home' exact component={Home}></Route>
    <Route path='/login' exact component={Login}></Route> 
    <Redirect to="/home" from='/' exact /> 
</Switch>
```

上面，当访问路由`/`时，会直接重定向到`/home`

`Redirect` 常在用户是否登录：

```
class Center extends PureComponent {
    render() {
        const { loginStatus } = this.props;
        if (loginStatus) {
            return (
                <div>个人中心</div>
            )
        } else {
            return <Redirect to='/login' />
        }
    }
}
```
也可使用对象形式：
```
<Redirect
  to={{
    pathname: "/login",
    search: "?utm=your+face",
    state: { referrer: currentLocation }
  }}
/>
```

## withRouter

`withRouter` 可以将一个非路由组件包裹为路由组件，使这个非路由组件也能访问到当前路由的`match`, `location`, `history`对象。

```
import { withRouter } from 'react-router-dom';
class Detail extends Component {
    render() {
        ··· ···
    } 
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Detail))
```

# 路由对象

路由组件中在`props`中可以取到路由对象

## history

`history` 对象通常会具有以下属性和方法：

- `length`: `history` 堆栈的条目数

- `action`: 当前的操作(`PUSH`, `REPLACE`, `POP`)

- `location`: 当前的路径信息。`location` 会具有以下属性

  - `pathname` : URL 路径
  
  - `search`: URL 中的查询字符串
  
  - `hash`: URL 的哈希片段
  
  - `state`: 获取`history.push('/about', {abc: 23})`的第二个参数，`history.location.state // {abc: 23}`
  
- `push(path, [state])`: 在 `history` 堆栈添加一个路由记录,并将路由至`path`

- `replace(path, [state])`: 替换 `history` 当前路由记录,并将路由至`path`

- `go(n)`: 直接将路转至 `history` 某个记录，如`history.go(-1)// 返回上一页`

- `goBack()`: 等同于 `go(-1)`

- `goForward()`: 等同于 `go(1)`

- `block(prompt)`: 允许您监听`location`并触发`window.confirm`提示信息呈现给用户

  ```
  // 或者在需要时使用返回消息的函数。
  history.block((location, action) => {
    //location和action参数指示我们要转换到的位置以及如何到达那里。
  
    //一个常见的用例是防止用户在有表单尚未提交时离开页面。
    if (input.value !== '') return 'Are you sure you want to leave this page?';
  });
  ```
  如果需要使用自定义弹层提示，需要重写此行为，则在创建历史对象时提供`getUserConfirmation`。
  
  ```
  const history = createHistory({
    getUserConfirmation(message, callback) {
      // 向用户显示一些自定义对话框并调用callback（true）继续传输，或调用callback（false）中止传输。
    }
  });
  ```
  
**只有通过 Route 组件渲染的组件，才能在 `this.props` 上找到 `history` 对象**

# 路由过渡动画

```
import { TransitionGroup, CSSTransition } from "react-transition-group";

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <Fragment> 
          <BrowserRouter>
            <div>
              <Header />
              
              {/* 最外部的<Route></Route>不进行任何路由匹配，仅仅是用来传递 location */}
              
              <Route render={({location}) => {
                console.log(location);
                return (
                  <TransitionGroup>
                    <CSSTransition
                      key={location.key}
                      classNames='fade'
                      timeout={300}
                    >
                      <Switch>
                        <Redirect exact from='/' to='/home' />
                        <Route path='/home' exact component={Home}></Route>
                        <Route path='/login' exact component={Login}></Route>
                        <Route path='/write' exact component={Write}></Route>
                        <Route path='/detail/:id' exact component={Detail}></Route>
                        <Route render={() => <div>Not Found</div>} />
                      </Switch>
                    </CSSTransition>
                  </TransitionGroup>
                )
              }}>
              </Route>
            </div>
          </BrowserRouter>
        </Fragment>
      </Provider>
    )
  }
}
--------------------------------------------------------
.fade-enter {
  opacity: 0;
  z-index: 1;
}

.fade-enter.fade-enter-active {
  opacity: 1;
  transition: opacity 300ms ease-in;
}
```

# createBrowserHistory

上文有提到过，只有路由组件的`props`中才有`history`方法，对于非路由组件如果要有`history`属性，有两个种方法：

- 使用`withRouter`包装组件

  ```
  import { withRouter } from 'react-router-dom';
  class Detail extends Component {
      render() {
          ··· ···
      } 
  }
  export default withRouter(Detail)
  ```
  
- 使用`createBrowserHistory`方法

  ```
  import { createBrowserHistory } from 'history'
  function About() {
      console.log(createBrowserHistory())
      return <h1>Hello, About</h1>;
  }
  ```
  
# 集中配置式路由

```
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import {renderRoutes} from 'react-router-config'

function About() {
    return <h1>Hello, About</h1>;
}
function Inbox() {
    return <h1>Hello, Inbox</h1>;
}
function App() {
    return <h1>App</h1>;
}
const routerConfig = [
    {
        path: '/',
        component: App,
        name: 'App',
        childRouter: [
            { path: '/about', component: About, name: 'About' },
            { path: 'inbox', component: Inbox, name: 'Inbox'}

        ]
    },
]
function App() {
    return (
        <>
            <BrowserRouter>
                {renderRoutes(routeConfig)}
            </BrowserRouter>
        </>
    )
}

export default App
```
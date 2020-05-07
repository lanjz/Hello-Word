# Vue和React的区别

- View 层的表示：Vue 使用`模板+JavaScript+CSS`的组合,React 则使用的函数式编程

- 数据变化的响应：Vue提供反应式的数据，当数据改动时，界面就会自动更新；React里面需要调用方法`SetState`方法

- Vue组件分为全局注册和局部注册，在react中都是通过import相应组件，然后模版中引用

- 每个Vue实例都实现了事件接口，方便父子组件通信，小型项目中不需要引入状态管理机制，而react必需自己实现


- Vue 内置了很多方便的功能的,如果一些指令`v-model`，`v-if`,`v-for`,`watch`,`computed`等等，而React只能使用JSX语法
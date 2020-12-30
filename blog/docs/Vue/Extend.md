# Extend

使用 `Vue.extend` 方法使用创建一个“子类”。参数是一个包含组件选项的对象

`data` 选项是特例，需要注意 - 在 `Vue.extend()` 中它必须是函数

```html
<div id="mount-point"></div>
```

```js
// 创建构造器
var Profile = Vue.extend({
  template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>',
  data: function () {
    return {
      firstName: 'Walter',
      lastName: 'White',
      alias: 'Heisenberg'
    }
  }
})
// 创建 Profile 实例，并挂载到一个元素上。
new Profile().$mount('#mount-point')

```

结果如下：

```js
<p>Walter White aka Heisenberg</p>
```

平时会使用 `Vue.extend` 制作 Vue 公共插件

下面通过两个组件示例来了解一下用法

## 例子一-Toast组件

首先实现一个 `Toast` 组件

先实现 Toast 组件部分

```vue
// Toast.vue
<template>
  <transition name="fade">
    <div class="wrap" v-show="visible">{{title}}</div>
  </transition>
</template>
<script>
  export default {
    data(){
      return {
        title: '',
        visible: false,
      }
    },
  }
</script>

<style scoped>
  .wrap{
    position: fixed;
    left: 50%;
    top:100px;
    background: rgba(0,0,0,.6);
    padding: 10px;
    border-radius: 5px;
    /*transform: translateX(-50%);*/
    color:#fff;
    max-width: 400px;
    min-width: 100px;
    font-size: 15px;
    text-align: center;
    z-index: 9999;
  }
  .fade-enter-active, .fade-leave-active {
    transition: .3s ease-out;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(-20px);
  }
/*  .fade-enter-to, fade-leave{
    opacity: 1;
    transform: translateY(50px);
  }*/
</style>

```

使用 `vue.extend` 生成 `toast` 组件实例

```js
// toast.js
import vue from 'vue'

// 这里就是我们刚刚创建的那个静态组件
import toastComponent from './Toast.vue'

let instance

// 返回一个 扩展实例构造器
const ToastConstructor = vue.extend(toastComponent)

const initInstance = () => {
  // 生成 toast 组件实例
  instance = new ToastConstructor({
    el: document.createElement('div')
  })
  // 获者 instance = new ToastConstructor().$mount(document.createElement('div'))
}

// 通过 vue 实例就可以设置和获取实例中的属性和方法了
function initToast(options){
  if(!instance) {
    initInstance()
  }
  for(let item in options) {
    instance[item] = options[item]
  }
  if(instance) {
    // 将这个 vue 插入到 DOM 中
    document.body.appendChild(instance.$el)
  }
  // 显示这个 toast
  instance.visible = true
  // 过一定时间后隐藏这个组件
  setTimeout(() => {
    instance.visible = false
  }, options.duration)

}

const defaultOptions = {
  title: '',
  type: 'success',
  duration: 1500
}
// 注册为全局组件的函数
function registryToast(options) {
  if( Object.prototype.toString.call(options) !== '[object Object]') {
    options = {}
  }
  return initToast({ ...defaultOptions, ...options })
}
export default registryToast
```

然后再组装成插件，将方法保存到 `Vue.prototype` 中，这样就可以在作用所有组件中使用这个 `toast` 方法了

```js
// ./index.js
import toast from './toast.js'

export default {
  install(Vue, args = {}) {
    Vue.prototype.$toast = toast
  }
}
```

安装这个插件

```js
import Vue from 'vue'
import toast from '../components/toast/index'

Vue.use(toast)

// 在组件中使用这个组件
this.$toast({
  title: '成功显示了',
  duration: 2000
})
```

## 例子二-Alert

这个组件相比之前的 Toast 组件它多了一个回调方法

先实现组件

```vue
// MeaasgeBox.vue
<template>
  <div class="hello-message-box-bg" v-show="visible">
    <div class="hello-message-box">
      <div class="hello-content">
        <div class="hello-title" v-if="title">{{title}}</div>
        <div class="hello-des" v-if="type === 'test' && content">{{content}}</div>
        <div class="hello-des" v-if="type === 'html' && content" v-html="content"></div>
      </div>
      <div class="hello-btn-operate">
        <div class="hello-btn cancel" v-show="showCancel" @click="cancel(false)">{{cancelText}}</div>
        <div class="hello-btn confirm" @click="cancel(true)">{{confirmText}}</div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        title: '',
        content: '',
        confirmText: '',
        cancelText: '',
        type: 'test',
        visible: false,
        showCancel: true
      }
    },
    methods: {
      cancel(arg) {
        this.callback(arg)
      }
    },
    mounted() { }
  }
</script>

<style scoped lang="less">
  .hello-message-box-bg{
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .1);
    left: 0;
    top: 0;
    z-index: 999;
  }
  .hello-message-box{
    position: absolute;
    left: 50%;
    top:50%;
    background: #fff;
    border-radius: 8px;
    transform: translate(-50%,-50%);
    width: 300px;
    box-shadow: 0 0 3px 1px #c7c7c7;
    color: #333;
  }
  .hello-message-box .hello-title{
    text-align: center;
    font-weight: bold;
    font-size: 17px;
    margin-bottom: 5px;
  }
  .hello-content{
    padding: 15px;
    text-align: center;
  }
  .hello-des{
    word-break: break-all;
  }
  .hello-btn-operate{
    text-align: right;
    display: flex;
    border-top: solid 1px #c7c7c7;
  }
  .hello-btn-operate .hello-btn{
    flex: 1;
    text-align: center;
    padding: 10px 0;
    cursor: pointer;
  }
  .hello-btn-operate .confirm{
    color: dodgerblue;
  }
  .hello-btn-operate .hello-btn.cancel{
  }
  .hello-btn:not(:last-child) {
    border-right: solid 1px #c7c7c7;
  }
</style>
<style lang="less">
  .hello-message-box-bg{
    img{
      max-width: 200px;
      max-height: 500px;
    }
  }
</style>

```

使用 `vue.extend` 创建 `MeaasgeBox` 组件实例

```js
import vue from 'vue'

// 这里就是我们刚刚创建的那个静态组件
import toastComponent from './MessageBox.vue'

let instance, tempPro;

const MessageBoxConstructor = vue.extend(toastComponent)
const defaultCallback = action => {
  instance.visible = false;
  tempPro(action) // 执行回调
}

const initInstance = () => {
  instance = new MessageBoxConstructor({
    el: document.createElement('div')
  })
  instance.callback = defaultCallback // 接收组件回调
}


function showNextMsg(options) {
  if(!instance){
    initInstance()
  }
  for(let item in options) {
    instance[item] = options[item] // 属性赋值
  }
  if(instance){
    document.body.appendChild(instance.$el);
  }
  instance.visible = true;
}
function MessageBox(options){
  return new Promise((resolve, reject) => {
    tempPro = resolve // 将`resolve`保存到全局
    showNextMsg(options)
  })
}
const defaultOptions = {
  title: '',
  content: '',
  theme: 'confirm', // 'confirm',  'warn'
  type: 'test',
  confirmText: '确定',
  cancelText: '取消',
  showCancel: true
}

// 调用 Alert 后返回一个 Promise, 所以 MessageBox 也需要返回一个 Promise
function helloAlert(options){
  if( Object.prototype.toString.call(options) !== '[object Object]') {
    options = {}
  }
  return MessageBox({ ...defaultOptions, ...options })
}
export default helloAlert

```

使用

```js
helloAlert({title: 'title', content: 'content'})
  .then(res => {
    alert(res)
  })
```
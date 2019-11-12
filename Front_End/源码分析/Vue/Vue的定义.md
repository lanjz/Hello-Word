`src/core/instance/index.js`

```javascript
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
```

一开始`Vue`只是一个简单的函数，然后再后面将这个`Vue`函数作为参数传到一些方法中

这些方法在`Vue`的`prototype`上扩展方法

这种结构看到一目了然，一眼就明白各个模块在哪里定义和维护

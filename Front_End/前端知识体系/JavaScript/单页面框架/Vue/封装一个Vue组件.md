# 封装一个Vue组件

1. 完成Vue组件，假设这个组件为`toastComponent`

2. 使用`const ToastConstructor = vue.extend(toastComponent)`生成一个实例构造器

3. 一个生成具体实例的方法

  ```
  const initInstance = () => {
  instance = new ToastConstructor({
    el: document.createElement('div')
  })
  }
  ```

4. 一个将组件添加到DOM中的方法

  ```
  document.body.appendChild(instance.$el)
  ```
  如果需要传递属性，比如`name`,直接在`instance`添加对应属性：`instance.name="lanjz"`
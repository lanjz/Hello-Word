> [MDN | JSON.stringify()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)

`JSON.stringify()`特性：

1. 数组对象的属性不能保证以特定的顺序出现在序列化后的字符串中。

2. 布尔值、数字、字符串的包装对象在序列化过程中会自动转换成对应的原始值。

3. `undefined`、任意的函数以及 `symbol` 值，在序列化过程中会被忽略（出现在非数组对象的属性值中时）或者被转换成 null（出现在数组中时）。

4. 对包含循环引用的对象（对象之间相互引用，形成无限循环）执行此方法，会抛出错误。

5. 所有以 symbol 为属性键的属性都会被完全忽略掉，即便 replacer 参数中强制指定包含了它们。

6. 不可枚举的属性会被忽略

```
  function JsonToStr(json) {
    if(!json || typeof json === 'symbol' || typeof json === 'function') return
    if(typeof json !== 'object' ) {
      return json.toString()
    }
    const validKey = ['string', 'boolean', 'number']
    let str = ''
    const jsonType = Object.prototype.toString.call(json)
    Object.keys(json).forEach((key, index) => {
      const value =  (!json[key] || json[key].prototype) ? json[key] : json[key].toString() // 如果有值且不是对象，转为toString(),主要是针对类型new Number(1)这样的值
      // 判断是否是有效的key
      if(validKey.indexOf(typeof key) > -1) {
        const pre = jsonType === '[object Object]' ?　key+':' :  '' // 如果是数组不需要显示{key：}
        if(jsonType === '[object Object]' && value !== undefined && typeof value !== 'function' && typeof value !== 'symbol' ) {
          if(validKey.indexOf(typeof value) > -1) { // 过滤function和object类型的值
            str = str + `${pre}${value.toString()}`
          } else if(typeof value  === 'object' ) {
            str = str + `${pre}${JsonToStr(value)}`
          }
          str = str + (index === Object.keys(json).length - 1 ? '' : ',') // 最后一值末尾不需要分号
        } else if(jsonType === '[object Array]') {
          if(typeof value === 'undefined' || typeof value !== 'function' || typeof value !== 'symbol') {
            str = str + `${pre}null`
          }else if(validKey.indexOf(typeof value) > -1)  { // 过滤function和object类型的值
            str = str + `${pre}${value.toString()}`
          } else if(typeof value  === 'object' ) {
            str = str + `${pre}${JsonToStr(value)}`
          }
          str = str + (index === Object.keys(json).length - 1 ? '' : ',') // 最后一值末尾不需要分号
        }
      }
    })
    if(jsonType === '[object Array]') {
      return `[${str}]`
    }
    return `{${str}}`
  }
```

以上函数不支持像`JSON.stringify`那样传入第二、第三个参数，第6点也不支持，写不下去了，我的天

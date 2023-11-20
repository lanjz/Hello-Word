# 配置化表格（CTable）

基于 el-table，通过配置的形式自动请求数据并生成表格. eg:

```vue
  <div class="padding-r-b-l">
    <CTable
        @selection-change="handleSelectChange"
        ref="table"
        :columns="tableColumns"
        :postData="filterSearchData"
        :filterData="filterTableData"
        :filterFetchParams="filterFetchParams"
        method="post"
        url="/tsUser/userData"
    />
  </div>
```

使用配置化的好处：

- 提高开发效率

- 只需要关心配置，维护更方便

- 减少模板的代码数量

## 基础配置

为了与整个项目的请求保持一致，因此 CTable 组件并没有内置封装请求，因此需要在注册 C-VIEW 全局组件通过配置传入请求方法接口供 CTable 使用. eg:

```js
Vue.use(appGlobal, {
  tableFetch: function (){
    return fetch(...arguments).then(res => {
      let { err, data } = res
      if(err){
        return {err}
      }
      return {
        data: {
          list: data.result,
          total: data.totalSize,
          originData: data
        }
      }
    })
  },
  tableDefaultProps: {
    border: true
  },
  pageDefaultProps: {}
})
```

上面的例子配置只设置了三个属性：

- `tableFetch`：即 CTable 请求数据的方法，CTable 将通过 `tableFetch` 发起请求，参数格式如下：

   ```js
   tableFetch({url: 'api', method: 'get', params: {}, data: {} })
   ```

  注意后面的 `return` ， CTable 并不关心的自带的 `fetch` 是什么格式， 只需要最终返回组件需要的格式即可

   ```js
    {
      err: '',  // 通过这个属性来判断当前请求是否成功
      data: {
          list: xxx,  // 通过 data.list 获取表格数据
          total: xxx, // 通过 data.total 获取表格数据总数
          originData: xxx, // 通过 data.originData 获取最初 fetch 的返回值，用于自定义修改使用
      }
    }
   ```

- `tableDefaultProps`: 应用于 `el-table` 的属性

- `pageDefaultProps`: 应用于 `el-pagination` 的属性，默认的 `el-pagination` 属性为：

  ```js
  {
   'page-sizes': [10, 20, 40, 60],
    layout: 'total,->, sizes,prev, pager, next',
  }
  ```

## CTable 属性说明

CTable 支持 `el-table` 的全部属性，同时还添加了以下属性：

### columns 属性

`columns` 是一个数组，数组中的每项都是配置 `el-table-column` 属性， 对于自定义内容可以通过 `render` 属性进行渲染. eg:

```js
{
  prop: 'costCenterName',
  label: '成本中心',
  'show-overflow-tooltip': true,
  width: 150,
  render: (h, scope) => {
    return <div class="text-ellipsis">{scope.row.costCenterCode}/{scope.row.costCenterName}</div>
  }
},
```

### params 属性

格式： `{ Object }`

发送请求时赋加的 url 参数

### postData属性

格式： `{ Object }`

发送请求时需要添加的 `data` 参数，仅在 `post` 时会用到

### filterFetchParams 属性

格式： `{ Function }`

发起请求时对请求参数进行过滤，即可以传函数属性来改变最终发送出去请求参数，此时请求会包含传给 CTable 的参数与分页参数的合并数据，无论是 `get` 和 `post` 都是通过该方法进行处理

### method 属性

格式： `{ get | post }`

请求方式，只支持 `get` 或 `post`

### url属性

请求地址

### suspended

格式： `{ Boolean }`

默认情况下当前 CTable 组件 `mounted` 后会自动执行请求方法进行数据获取，`suspended` 表示渲染后不自动获取数据

### filterData

格式： `{ Function }`

获取到数据对返回的数据进行过滤，值必需是函数

### paginationDProps

格式： `{ Object }`

分页配置，可以覆盖默认的分页配置

## 组件方法

- `fetchData()`： 根据当前分页状态，重新发起数据请求的方法

- `reFetchData()`： 重置分页状态并请求数据

- `getTable()`: 获了 el-table 组件实例

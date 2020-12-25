import Foo from "./pages/Foo.vue";
import Bar from "./pages/Bar.vue";
import Bar1 from "./pages/Bar1.vue";
import Bar2 from "./pages/Bar2.vue";


// 2. 定义路由
// 每个路由应该映射一个组件。 其中"hllComponent" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。
// 我们晚点再讨论嵌套路由。
const routes = [
    { path: '/foo', component: Foo },
    {
        path: '/bar', component: Bar,
        children: [
            // 当 /user/:id 匹配成功，
            // UserHome 会被渲染在 User 的 <router-view> 中
            { path: '', component: Bar1 },
            { path: 'bar2', component: Bar2 },

            // ...其他子路由
        ]
    },
]
export default routes
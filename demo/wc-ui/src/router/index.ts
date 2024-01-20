import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'
export type RouterConfig = RouteRecordRaw & {
  label?: string
  group?: string
}
export const wcRoutes: RouterConfig[] = []
const modulesFiles: Record<string, any> = import.meta.glob(
  '../examples/*/*/index.vue',
)
const modulePaths: string[] = Object.keys(modulesFiles)
for (const item of modulePaths) {
  const moduleName = item.replace(/^\.\.\/examples\/(.*)\/(.*)\.\w+$/, '$1')
  const folderNames = moduleName.split('/')
  const getModule = await modulesFiles[item]()
  const module = getModule.default
  wcRoutes.push({
    group: folderNames[0],
    path: `/wc/${folderNames[1]}`,
    name: folderNames[1],
    label: module.aliasName,
    component: module,
  })
}

export const mainRouter: Array<RouterConfig> = [
  {
    label: '开发',
    path: '/dev',
    component: defineAsyncComponent(() => import('../views/Home.vue')),
  },
  {
    label: '组件',
    path: '/wc',
    component: defineAsyncComponent(
      () => import('../views/component-page/index.vue'),
    ),
    children: wcRoutes.filter((item) => !!item.component),
  },
  {
    label: 'Lit',
    path: '/lit',
    component: defineAsyncComponent(() => import('../views/lit-doc/index.vue')),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: mainRouter,
})

export default router

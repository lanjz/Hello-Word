import { path } from '@vuepress/utils'
import { defineUserConfig } from 'vuepress'
import { defaultTheme } from '@vuepress/theme-default'
import { registerComponentsPlugin } from '@vuepress/plugin-register-components'
import { navbar, sidebar } from './nav'


export default defineUserConfig({
    lang: 'zh-CN',
    title: 'LLL Blog',
    description: '前端总结与记录',
    port: 5000,
    base: '/lanjz/',
    theme: defaultTheme({
        colorMode: 'dark',
        sidebarDepth: 2,
        navbar,
        sidebar,
    }),
    plugins: [
        registerComponentsPlugin({
            // 配置项
            componentsDir: path.resolve(__dirname, './components'),
        })
    ],
})
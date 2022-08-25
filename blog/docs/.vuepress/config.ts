import { path } from '@vuepress/utils'
import { defineUserConfig } from 'vuepress'
import { defaultTheme } from '@vuepress/theme-default'
// import { docsearchPlugin } from '@vuepress/plugin-docsearch'
import { registerComponentsPlugin } from '@vuepress/plugin-register-components'
import { navbar, sidebar } from './nav'
// import { searchPlugin } from '@vuepress/plugin-search'
// import {SearchPluginOptions} from "@vuepress/plugin-search/lib/node/searchPlugin";

/*const searchPluginOptions: SearchPluginOptions = {
    locales: {
        '/': {
            placeholder: 'Search',
        },
        '/zh/': {
            placeholder: '搜索',
        },
    },
}
const a = searchPlugin(searchPluginOptions)*/
// console.log('a',a )
/*const searchConfig:any = docsearchPlugin({
    appId: '',
    apiKey: '',
    indexName: ''
})*/
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
        }),
        // searchConfig,
    ],
})

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: 'src/auto-import.d.ts', // 路径下自动生成文件夹存放全局指令,解决ts 报错
      // 解决eslint报错问题
      eslintrc: {
        enabled: true,
      },
    }),
  ],
  /* 其他配置项 */
  optimizeDeps: {
    include: ['vue'],
  },
  resolve: {
    // 配置路径别名
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        javascriptEnabled: true,
        additionalData: `@import "src/assets/style/var.scss";`,
      },
    },
  },
})

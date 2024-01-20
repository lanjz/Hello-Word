module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended", // ESLint 官方提供的推荐配置，包含一些常见的规则
    "plugin:@typescript-eslint/recommended", // 提供了针对 TypeScript 的一些额外检查规则
    "plugin:vue/vue3-essential", // 这个插件提供了 Vue.js 3 的相关规则和支持
    "plugin:prettier/recommended", // 必需放在最后面 这个插件集成了 Prettier 格式化工具，并使其与 ESLint 兼容
    "./.eslintrc-auto-import.json"
  ],
  "overrides": [
    {
      "env": {
        "node": true
      },
      "files": [
        ".eslintrc.{js,cjs}"
      ],
      "parserOptions": {
        "sourceType": "script"
      }
    }
  ],
  "parserOptions": {
    "ecmaVersion": "latest", // 指定要使用的 ECMAScript 版本（latest 表示最新版本）
    "parser": "@typescript-eslint/parser", // 指定要使用的解析器（在这里是 @typescript-eslint/parser，用于解析 TypeScript）
    "sourceType": "module", // 指定代码模块类型（在这里是 module）
  },
  "plugins": [
    "@typescript-eslint", // 用于支持 TypeScript 的规则和功能;
    "vue" // 用于支持 Vue.js 相关规则和功能
  ],
  "rules": {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'off',
    'vue/no-deprecated-slot-attribute': 'off',
    "@typescript-eslint/no-explicit-any": "off",
    "end_of_line": 'off'
  }
}

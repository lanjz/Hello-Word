
<template>
  <bubble-menu
      v-if="editor"
      class="bubble-menu"
      :tippy-options="{ duration: 100,placement: 'top-start', maxWidth: 'none', offset: [-10, 10] }"
      :editor="editor"
  >
    <el-dropdown @command="handleFontFamily">
      <button class="el-dropdown-link" :class="{'is-active': actFont}">
        {{actFont || 'Inter'}}
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
              v-for="item in FONT_FAMILIES"
              :command="item.value"
              :disabled="item.disabled"
              :class="{'is-act': actFont && item.value===actFont}"
              :key="item.value">{{item.label}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-dropdown @command="handleFontSize">
      <button class="el-dropdown-link" :class="{'is-active': actFontSize}">
        {{FONT_SIZES_MAP[actFontSize] || 'Medium'}}
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
              v-for="item in FONT_SIZES"
              :command="item.value"
              :class="{'is-act': actFontSize && item.value===actFontSize}"
              :key="item.value">
            {{item.label}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
      加粗
    </button>
    <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
      斜体
    </button>
    <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
      删除线
    </button>
    <button @click="editor.chain().focus().toggleCode().run()" :disabled="!editor.can().chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }">
      代码
    </button>
    <button @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }">
      代码块
    </button>
    <button @click="editor.chain().focus().setHorizontalRule().run()">
      水平分割线
    </button>
    <button @click="editor.chain().focus().setHardBreak().run()">
      换行
    </button>
  </bubble-menu>
</template>
<script>
import { BubbleMenu } from '@tiptap/vue-3'


const FONT_SIZES = [
  { label: 'Smaller', value: '12px' },
  { label: 'Small', value: '14px' },
  { label: 'Medium', value: '' },
  { label: 'Large', value: '18px' },
  { label: 'Extra Large', value: '24px' },
]
const FONT_SIZES_MAP = {}
FONT_SIZES.forEach(item => {
  FONT_SIZES_MAP[item.value] = item.label
})
const FONT_FAMILY_GROUPS = [
  {
    label: 'Sans Serif',
    options: [
      { label: 'Inter', value: '' },
      { label: 'Arial', value: 'Arial' },
      { label: 'Helvetica', value: 'Helvetica' },
    ],
  },
  {
    label: 'Serif',
    options: [
      { label: 'Times New Roman', value: 'Times' },
      { label: 'Garamond', value: 'Garamond' },
      { label: 'Georgia', value: 'Georgia' },
    ],
  },
  {
    label: 'Monospace',
    options: [
      { label: 'Courier', value: 'Courier' },
      { label: 'Courier New', value: 'Courier New' },
    ],
  },
]
const FONT_FAMILIES = []
FONT_FAMILY_GROUPS.forEach(item => {
  FONT_FAMILIES.push({
    label: item.label,
    value: item.label,
    disabled: true,
  })
  FONT_FAMILIES.push(...item.options)
})
export default {
  props: ['editor'],
  components: {
    BubbleMenu
  },
  data() {
    return {
      FONT_FAMILIES,
      FONT_SIZES,
      FONT_SIZES_MAP,
      currentFont: {}
    }
  },
  computed: {
    actFont() {
      return this.editor.getAttributes('textStyle')?.fontFamily || undefined
    },
    actFontSize() {
      console.log('actFontSize', this.editor.getAttributes('textStyle'))
      return this.editor.getAttributes('textStyle')?.fontSize || undefined
    }
  },
  methods: {
    handleFontFamily(font){
      if (!font || font.length === 0) {
        return this.editor.chain().focus().unsetFontFamily().run()
      }
      return this.editor.chain().focus().setFontFamily(font).run()
    },
    handleFontSize(size) {
      if (!size || size.length === 0) {
        return this.editor.chain().focus().unsetFontSize().run()
      }
      return this.editor.chain().focus().setFontSize(size).run()
    }
  },
}
</script>

<style scoped lang="scss">
.bubble-menu {
  display: flex;
  background-color: #fff;
  padding: 6px;
  border-radius: 0.5rem;
  box-shadow: var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow);

  button {
    border: none;
    background: none;
    font-weight: 500;
    padding: 4px 10px;
    white-space: nowrap;
    opacity: 0.6;
    border-radius: 4px;
    margin: 0 2px;
    font-size: 13px;
    cursor: pointer;
    &:hover,
    &.is-active {
      opacity: 1;
    }
    &:hover {
      background: #f5f4f4;
    }
    &.is-active {
      background-color: #eee;
    }
  }
}

::v-deep{
  .el-dropdown-menu__item.is-disabled{
    font-size: 12px;
    &:not(:first-child){
      border-top: solid 1px var(--el-dropdown-menuItem-hover-fill);
    }
  }
  .el-dropdown-menu__item.is-act{
    background-color: var(--el-dropdown-menuItem-hover-fill);
    color: var(--el-dropdown-menuItem-hover-color);
  }
}
</style>
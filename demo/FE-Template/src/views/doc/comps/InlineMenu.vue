
<template>
  <bubble-menu
      v-if="editor"
      class="bubble-menu"
      :tippy-options="{
        duration: 100,
        placement: 'top-start',
        maxWidth: 'none',
        offset: [-10, 10],
        onHidden: onHiddenBubble
      }"
      plugin-key="inlineBubbleMenu"
      :editor="editor"
  >
    <el-dropdown @command="handleFontFamily">
      <button class="el-dropdown-link" :class="{'is-active': actFont}">
        {{actFont || 'Inter'}}
        <CIcon style="font-size: 13px;margin-left: 8px" name="icon-xiangxia" isFont />
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
        <CIcon style="font-size: 13px;margin-left: 8px" name="icon-xiangxia" isFont />
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
    <div class="split-line"></div>
    <el-tooltip effect="light" content="加粗" placement="top">
      <template #content>
        <InstructionPrompt title="加粗" :shortcut="['Mod', 'B']" />
      </template>
      <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
         <CIcon name="icon-jiacu" isFont />
      </button>
    </el-tooltip>
    <el-tooltip effect="light" content="斜体" placement="top">
      <template #content>
        <InstructionPrompt title="斜体" :shortcut="['Mod', 'I']" />
      </template>
      <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
        <CIcon name="icon-xieti" isFont />
      </button>
    </el-tooltip>
    <el-tooltip effect="light" content="下划线" placement="top">
      <template #content>
        <InstructionPrompt title="下划线" :shortcut="['Mod', 'U']" />
      </template>
      <button @click="editor.chain().focus().toggleUnderline().run()" :class="{ 'is-active': editor.isActive('underline') }">
         <CIcon name="icon-a-xiahuaxian3x" isFont />
      </button>
    </el-tooltip>

    <el-tooltip effect="light" content="删除线" placement="top">
      <template #content>
        <InstructionPrompt title="加粗" :shortcut="['Mod', 'X']" />
      </template>
      <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
         <CIcon name="icon-a-shanchuxian3x" isFont />
      </button>
    </el-tooltip>

    <el-tooltip effect="light" content="代码" placement="top">
      <template #content>
        <InstructionPrompt title="代码" :shortcut="['Mod', 'E']" />
      </template>
      <button @click="editor.chain().focus().toggleCode().run()" :disabled="!editor.can().chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }">
         <CIcon name="icon-code" isFont />
      </button>
    </el-tooltip>
    <el-tooltip effect="light" content="代码块" placement="top">
      <template #content>
        <InstructionPrompt title="代码块" />
      </template>
      <button @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }">
         <CIcon  name="icon-code1" isFont />
      </button>
    </el-tooltip>

    <el-tooltip effect="light" content="文本颜色" placement="top">
      <template #content>
        <InstructionPrompt title="文本颜色" />
      </template>
      <button :class="{ 'is-active': actFontColor }">
        <CIcon :color="actFontColor"  class="edit-icon" name="icon-yanse" isFont />
        <el-color-picker class="hide-el" @change="changeColor" :model-value="actFontColor" :predefine="PRE_DEFINE_COLORS" />
      </button>
    </el-tooltip>
    <el-tooltip effect="light" content="文本背景色" placement="top">
      <template #content>
        <InstructionPrompt title="文本背景色" />
      </template>
      <button :class="{ 'is-active': actHighlight }">
        <CIcon :color="actHighlight" name="icon-tumo" isFont />
        <el-color-picker class="hide-el" @change="changeHighlight" :model-value="actHighlight" show-alpha :predefine="PRE_DEFINE_COLORS" />
      </button>
    </el-tooltip>

    <el-tooltip effect="light" content="添加链接" placement="top">
      <template #content>
        <InstructionPrompt title="添加链接" />
      </template>
      <button @click="setLink" :class="{ 'is-active': editor.isActive('link') }">
        <CIcon name="icon-link" isFont />
      </button>
    </el-tooltip>
    <el-tooltip effect="light" content="清除链接" placement="top">
      <template #content>
        <InstructionPrompt title="清除链接" />
      </template>
      <button @click="editor.chain().focus().unsetLink().run()" :disabled="!editor.isActive('link')">
        <CIcon name="icon-shanchulianjie1" isFont></CIcon>
      </button>
    </el-tooltip>
    <el-tooltip :disabled="showMoreMenuPopup" effect="light" content="更多" placement="top">
      <template #content>
        <InstructionPrompt title="更多" />
      </template>
      <CIcon @click="showMoreMenuPopup=!showMoreMenuPopup" class="global-pointer" style="margin-right: 8px" name="icon-gengduo" isFont />
    </el-tooltip>
   <div class="more-menu-popup" v-if="showMoreMenuPopup">
      <div class="bubble-menu">
        <el-tooltip effect="light" content="下标" placement="top">
          <template #content>
            <InstructionPrompt title="下标" :shortcut="['Mod', '.']" />
          </template>
          <button @click="showMoreMenuPopup=false;editor.chain().focus().toggleSubscript().run()"  :class="{ 'is-active': editor.isActive('subscript')}">
            <CIcon name="icon-xiabiao" isFont />
          </button>
        </el-tooltip>
        <el-tooltip effect="light" content="上标" placement="top">
          <template #content>
            <InstructionPrompt title="上标" :shortcut="['Mod', ',']" />
          </template>
          <button @click="showMoreMenuPopup=false;editor.chain().focus().toggleSuperscript().run()" :class="{ 'is-active': editor.isActive('superscript') }">
            <CIcon  name="icon-shangbiao" isFont />
          </button>
        </el-tooltip>
      </div>
    </div>
  </bubble-menu>
</template>
<script>
import { BubbleMenu } from '@tiptap/vue-3'
import InstructionPrompt from './InstructionPrompt.vue'
import AppLink from '@/layouts/main/components/common/app-link.vue'

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
const PRE_DEFINE_COLORS = [
  '#ffffff',
  '#000000',
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
]
export default {
  props: ['editor'],
  components: {
    AppLink,
    BubbleMenu,
    InstructionPrompt
  },
  data() {
    return {
      // 字体
      FONT_FAMILIES,
      // 字号
      FONT_SIZES,
      FONT_SIZES_MAP,
      // 颜色
      PRE_DEFINE_COLORS,
      showMoreMenuPopup: false,
    }
  },
  computed: {
    actFont() {
      return this.editor.getAttributes('textStyle')?.fontFamily || undefined
    },
    actFontSize() {
      return this.editor.getAttributes('textStyle')?.fontSize || undefined
    },
    actFontColor() {
      return this.editor.getAttributes('textStyle')?.color || undefined
    },
    actHighlight() {
      return this.editor.getAttributes('highlight')?.color || undefined
    }
  },
  methods: {
    onHiddenBubble(value) {
      this.showMoreMenuPopup = false
    },
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
    },
    changeColor(color) {
      if (!color || color.length === 0) {
        return this.editor.chain().focus().unsetColor().run()
      }
      return this.editor.chain().focus().setColor(color).run()

    },
    changeHighlight(color) {
      if (!color || color.length === 0) {
        return this.editor.chain().focus().unsetHighlight().run()
      }
      return this.editor.chain().focus().toggleHighlight({color}).run()

    },
    setLink() {
      const previousUrl = this.editor.getAttributes('link').href
      const url = window.prompt('URL', previousUrl)
      // cancelled
      if (url === null) {
        return
      }
      // empty
      if (url === '') {
        this.editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .unsetLink()
            .run()

        return
      }
      // update link
      this.editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: url, target: '_blank'  })
          .run()
    },
  },
}
</script>

<style scoped lang="scss">
.bubble-menu {
  display: flex;
  background-color: #fff;
  padding: 6px;
  align-items: center;
  border-radius: 0.5rem;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
  button {
    border: none;
    background: none;
    font-weight: 500;
    padding: 4px 8px;
    white-space: nowrap;
    opacity: 0.6;
    border-radius: 4px;
    margin: 0 2px;
    font-size: 13px;
    cursor: pointer;
    position: relative;
    align-items: center;
    display: flex;
    ::v-deep{
      .el-color-picker{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        opacity: 0;
      }
      .iconfont {
        font-size: 20px;
      }
    }
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
.split-line{
  width: 1px;
  height: 20px;
  background: #dedede;
  margin: 0 10px;
}
.more-menu-popup{
  border-radius: 4px;
  background: #fff;
  position: absolute;
  bottom: 100%;
  right: -10px;
  transform: translateY(-5px);
  box-shadow: var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow);
}
</style>
<style lang="scss">

</style>
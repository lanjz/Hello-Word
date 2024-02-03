<template>
  <div class="menu-wrap">
    <div class="menu-item-class">HIERARCHY</div>
    <div class="menu-item-wrap" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
      <CIcon name="icon-h1" class="icon" isFont /><span>标题一</span>
    </div>
    <div class="menu-item-wrap" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
      <CIcon name="icon-h2" class="icon" isFont /><span>标题二</span>
    </div>
    <div class="menu-item-wrap" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
      <CIcon name="icon-h3" class="icon" isFont /><span>标题三</span>
    </div>
    <div class="menu-item-wrap" @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">
      <CIcon name="icon-h4" class="icon" isFont /><span>标题四</span>
    </div>
    <div class="menu-item-wrap" @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">
      <CIcon name="icon-h5" class="icon" isFont /><span>标题五</span>
    </div>
    <div class="menu-item-wrap" @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">
      <CIcon name="icon-h-6" class="icon" isFont /><span>标题六</span>
    </div>
    <div class="menu-item-wrap" @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }">
      <CIcon name="icon-duanla" class="icon" isFont /><span>段落</span>
    </div>
    <div class="menu-item-wrap" @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }">
      <CIcon name="icon-blockquote" class="icon" isFont /><span>引用</span>
    </div>
    <div class="menu-item-wrap" @click="addImage">
      <CIcon name="icon-tupian1" class="icon" isFont /><span>图片</span>
    </div>
    <div class="menu-item-wrap" @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }">
      <CIcon  name="icon-code1" class="icon" isFont /> <span>代码块</span>
    </div>
    <div class="menu-item-class">LISTS</div>
    <div class="menu-item-wrap" @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
      <CIcon name="icon-unorderedList" class="icon" isFont /><span>无序列表</span>
    </div>
    <div class="menu-item-wrap" @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">
      <CIcon name="icon-orderedList" class="icon" isFont /><span>有序列表</span>
    </div>
    <div class="menu-item-wrap" @click="editor.chain().focus().toggleTaskList().run()" :class="{ 'is-active': editor.isActive('taskList') }">
      <CIcon name="icon-todo-list" class="icon" isFont /><span>待办列表</span>
    </div>
    <div class="menu-item-wrap" @click="editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()">
      <CIcon name="icon-biaoge" class="icon" isFont /><span>插入表格</span>
    </div>
  </div>
</template>
<script>
export default {
  props: ['editor'],
  data() {
    return {
    }
  },
  computed: {

  },
  methods: {
    addImage() {
      const url = window.prompt('URL')

      if (url) {
        this.editor.chain().focus().setImage({ src: url }).run()
      }
    },
  },
}
</script>

<style scoped lang="scss">
.menu-wrap{
  background: #fff;
  padding: 10px;
  border-radius: 5px;
  color: #666;
  min-width: 160px;
  max-height: 400px;
  overflow: auto;
}
.menu-item-class {
  font-size: 12px;
  padding: 4px 8px;
}
.menu-item-wrap {
  padding: 6px 8px;
  white-space: nowrap;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  position: relative;
  align-items: center;
  display: flex;
  .icon {
    margin-right: 8px;
    font-size: 14px;
    color: #666;
  }
  &:not(:last-child) {
    margin-bottom: 6px;
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
</style>
<style lang="scss">

</style>
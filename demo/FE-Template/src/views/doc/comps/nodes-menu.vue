<template>
  <div class="menu-wrap">
    <el-tooltip effect="light" content="标题一" placement="top">
      <div class="menu-item-wrap" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
        <CIcon name="icon-h1" class="icon" isFont />
      </div>
    </el-tooltip>
    <el-tooltip effect="light" content="标题二" placement="top">
      <div class="menu-item-wrap" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
        <CIcon name="icon-h2" class="icon" isFont />
      </div>
    </el-tooltip>
    <el-tooltip effect="light" content="标题三" placement="top">
      <div class="menu-item-wrap" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
        <CIcon name="icon-h3" class="icon" isFont />
      </div>
    </el-tooltip>
    <el-tooltip effect="light" content="标题四" placement="top">
      <div class="menu-item-wrap" @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">
        <CIcon name="icon-h4" class="icon" isFont />
      </div>
    </el-tooltip>
    <el-tooltip effect="light" content="标题五" placement="top">
      <div class="menu-item-wrap" @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">
        <CIcon name="icon-h5" class="icon" isFont />
      </div>
    </el-tooltip>
    <el-tooltip effect="light" content="标题六" placement="top">
      <div class="menu-item-wrap" @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">
        <CIcon name="icon-h-6" class="icon" isFont />
      </div>
    </el-tooltip>
    <el-tooltip effect="light" content="段落" placement="top">
      <div class="menu-item-wrap" @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }">
        <CIcon name="icon-duanla" class="icon" isFont />
      </div>
    </el-tooltip>
    <el-tooltip effect="light" content="引用" placement="top">
      <div class="menu-item-wrap" @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }">
        <CIcon name="icon-blockquote" class="icon" isFont />
      </div>
    </el-tooltip>
    <el-tooltip effect="light" content="代码块" placement="top">
      <div class="menu-item-wrap" @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }">
        <CIcon  name="icon-code1" class="icon" isFont />
      </div>
    </el-tooltip>
    <el-tooltip effect="light" content="无序列表" placement="top">
      <div class="menu-item-wrap" @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
        <CIcon name="icon-unorderedList" class="icon" isFont />
      </div>
    </el-tooltip>
    <el-tooltip effect="light" content="有序列表" placement="top">
      <div class="menu-item-wrap" @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">
        <CIcon name="icon-orderedList" class="icon" isFont />
      </div>
    </el-tooltip>
    <el-tooltip effect="light" content="待办列表" placement="top">
      <div class="menu-item-wrap" @click="editor.chain().focus().toggleTaskList().run()" :class="{ 'is-active': editor.isActive('taskList') }">
        <CIcon name="icon-todo-list" class="icon" isFont />
      </div>
    </el-tooltip>
    <el-tooltip effect="light" content="插入表格" placement="top">
      <div class="menu-item-wrap" @click="editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()">
        <CIcon name="icon-biaoge" class="icon" isFont />
      </div>
    </el-tooltip>

  </div>
</template>
<script>
import InstructionPrompt from "@/views/doc/comps/InstructionPrompt.vue";

export default {
  components: {InstructionPrompt},
  props: ['editor'],
  data() {
    return {
    }
  },
  computed: {

  },
  methods: {
  },
}
</script>

<style scoped lang="scss">
.menu-wrap{
  background: #fff;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
  align-items: center;
  border-radius: 0.5rem;
  color: #666;
  display: flex;
  padding: 6px 10px;
  gap: 4px
}

.menu-item-wrap {
  width: 34px;
  height: 34px;
  justify-content: center;
  white-space: nowrap;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  position: relative;
  align-items: center;
  display: flex;
  .icon {
    font-size: 16px;
    color: #666;
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
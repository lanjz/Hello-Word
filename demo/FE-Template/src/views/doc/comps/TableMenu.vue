<template>
  <div class="menu-wrap">
    <el-tooltip popper-style="padding: 6px" effect="light" content="标题" placement="left-start">
      <template #content>
       <div>
         <div class="inline-menu-item-wrap" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
           <CIcon name="icon-h1" class="icon" isFont /><span>标题一</span>
         </div>
         <div class="inline-menu-item-wrap" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
           <CIcon name="icon-h2" class="icon" isFont /><span>标题二</span>
         </div>
         <div class="inline-menu-item-wrap" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
           <CIcon name="icon-h3" class="icon" isFont /><span>标题三</span>
         </div>
         <div class="inline-menu-item-wrap" @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">
           <CIcon name="icon-h4" class="icon" isFont /><span>标题四</span>
         </div>
         <div class="inline-menu-item-wrap" @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">
           <CIcon name="icon-h5" class="icon" isFont /><span>标题五</span>
         </div>
         <div class="inline-menu-item-wrap" @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">
           <CIcon name="icon-h-6" class="icon" isFont /><span>标题六</span>
         </div>
       </div>
      </template>
      <el-button class="menu-item-wrap" :class="{ 'is-active': editor.isActive('heading') }">
        <CIcon class="ope-icon"  name="icon-biaotizhengwenqiehuan" isFont />
      </el-button>
    </el-tooltip>
    <el-tooltip effect="light" content="段落" placement="left">
      <template #content>
        <InstructionPrompt title="段落" />
      </template>
      <el-button class="menu-item-wrap" @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }">
        <CIcon class="ope-icon"  name="icon-duanla" isFont />
      </el-button>
    </el-tooltip>
    <el-tooltip effect="light" content="引用" placement="left">
      <template #content>
        <InstructionPrompt title="引用" />
      </template>
      <el-button class="menu-item-wrap" @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }">
        <CIcon name="icon-blockquote" class="icon" isFont />
      </el-button>
    </el-tooltip>
    <el-tooltip effect="light" content="代码块" placement="left">
      <template #content>
        <InstructionPrompt title="代码块" />
      </template>
      <el-button class="menu-item-wrap" @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }">
        <CIcon  name="icon-code1" class="icon" isFont />
      </el-button>
    </el-tooltip>
    <div class="split-line"></div>
    <el-tooltip popper-style="padding: 6px" effect="light" content="列表" placement="left-start">
      <template #content>
        <div>
          <div class="inline-menu-item-wrap" @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
            <CIcon name="icon-unorderedList" class="icon" isFont /><span>无序列表</span>
          </div>
          <div class="inline-menu-item-wrap" @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">
            <CIcon name="icon-orderedList" class="icon" isFont /><span>有序列表</span>
          </div>
          <div class="inline-menu-item-wrap" @click="editor.chain().focus().toggleTaskList().run()" :class="{ 'is-active': editor.isActive('taskList') }">
            <CIcon name="icon-todo-list" class="icon" isFont /><span>待办列表</span>
          </div>
        </div>
      </template>
      <el-button class="menu-item-wrap" :class="{ 'is-active': editor.isActive('bulletList') || editor.isActive('orderedList') || editor.isActive('taskList') }">
        <CIcon class="ope-icon"  name="icon-liebiao" isFont />
      </el-button>
    </el-tooltip>
    <el-tooltip effect="light" content="插入表格" placement="left">
      <template #content>
        <InstructionPrompt title="插入表格" />
      </template>
      <el-button class="menu-item-wrap" @click="editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()">
        <CIcon name="icon-biaoge" class="icon" isFont />
      </el-button>
    </el-tooltip>
    <div class="split-line"></div>
    <el-tooltip effect="light" content="左对齐" placement="left">
      <template #content>
        <InstructionPrompt title="左对齐" />
      </template>
      <el-button class="menu-item-wrap" @click="editor.chain().focus().setTextAlign('left').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }">
        <CIcon class="ope-icon"  name="icon-zuoduiqi-" isFont />
      </el-button>
    </el-tooltip>

    <el-tooltip effect="light" content="居中对齐" placement="left">
      <template #content>
        <InstructionPrompt title="居中对齐" />
      </template>
      <el-button class="menu-item-wrap" @click="editor.chain().focus().setTextAlign('center').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }">
        <CIcon class="ope-icon"  name="icon-juzhongduiqi" isFont />
      </el-button>
    </el-tooltip>
    <el-tooltip effect="light" content="右对齐" placement="left">
      <template #content>
        <InstructionPrompt title="右对齐" />
      </template>
      <el-button class="menu-item-wrap" @click="editor.chain().focus().setTextAlign('right').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }">
        <CIcon class="ope-icon"  name="icon-youduiqi-" isFont />
      </el-button>
    </el-tooltip>
    <el-tooltip effect="light" content="两侧对齐" placement="left">
      <template #content>
        <InstructionPrompt title="两侧对齐" />
      </template>
      <el-button class="menu-item-wrap" @click="editor.chain().focus().setTextAlign('justify').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }">
         <CIcon class="ope-icon"  name="icon-text-justify" isFont />
      </el-button>
    </el-tooltip>
    <div class="split-line"></div>
    <el-tooltip effect="light" content="插入图片" placement="left">
      <template #content>
        <InstructionPrompt title="插入图片" />
      </template>
      <el-button class="menu-item-wrap" @click="addImage">
        <CIcon class="ope-icon"  name="icon-tupian" isFont />
      </el-button>
    </el-tooltip>
    <el-tooltip effect="light" content="水平分割线" placement="left">
      <template #content>
        <InstructionPrompt title="水平分割线" />
      </template>
      <el-button class="menu-item-wrap"  @click="editor.chain().focus().setHorizontalRule().run()">
        <CIcon  name="icon-shanchu1" isFont />
      </el-button>
    </el-tooltip>
    <div class="split-line"></div>
    <template v-if="editor.isActive('table')">
      <el-tooltip effect="light" content="向前添加列" placement="left">
        <template #content>
          <InstructionPrompt title="向前添加列" />
        </template>
        <el-button class="menu-item-wrap" @click="editor.chain().focus().addColumnBefore().run()" :disabled="!editor.can().addColumnBefore()">
          <CIcon class="ope-icon"  name="icon-icon-test" isFont />
        </el-button>
      </el-tooltip>
      <el-tooltip effect="light" content="向后添加列" placement="left">
        <template #content>
          <InstructionPrompt title="向后添加列" />
        </template>
        <el-button class="menu-item-wrap" @click="editor.chain().focus().addColumnAfter().run()" :disabled="!editor.can().addColumnAfter()">
          <CIcon class="ope-icon"  name="icon-xliecaozuo-tianjiayoulie" isFont />
        </el-button>
      </el-tooltip>
      <el-tooltip effect="light" content="删除列" placement="left">
        <template #content>
          <InstructionPrompt title="删除列" />
        </template>
        <el-button class="menu-item-wrap" @click="editor.chain().focus().deleteColumn().run()" :disabled="!editor.can().deleteColumn()">
          <CIcon class="ope-icon"  name="icon-xshanchulie" isFont />
        </el-button>
      </el-tooltip>
      <el-tooltip effect="light" content="向上添加行" placement="left">
        <template #content>
          <InstructionPrompt title="向上添加行" />
        </template>
        <el-button class="menu-item-wrap" @click="editor.chain().focus().addRowBefore().run()" :disabled="!editor.can().addRowBefore()">
          <CIcon class="ope-icon"  name="icon-xhangcaozuo-tianjiashanghang" isFont />
        </el-button>
      </el-tooltip>
      <el-tooltip effect="light" content="向下添加行" placement="left">
        <template #content>
          <InstructionPrompt title="向下添加行" />
        </template>
        <el-button class="menu-item-wrap" @click="editor.chain().focus().addRowAfter().run()" :disabled="!editor.can().addRowAfter()">
          <CIcon class="ope-icon"  name="icon-xhangcaozuo-tianjiaxiahang" isFont />
        </el-button>
      </el-tooltip>
      <el-tooltip effect="light" content="删除行" placement="left">
        <template #content>
          <InstructionPrompt title="删除行" />
        </template>
        <el-button class="menu-item-wrap" @click="editor.chain().focus().deleteRow().run()" :disabled="!editor.can().deleteRow()">
          <CIcon class="ope-icon"  name="icon-shanchuhang1" isFont />
        </el-button>
      </el-tooltip>
      <el-tooltip effect="light" content="删除表格" placement="left">
        <template #content>
          <InstructionPrompt title="删除表格" />
        </template>
        <el-button class="menu-item-wrap" @click="editor.chain().focus().deleteTable().run()" :disabled="!editor.can().deleteTable()">
          <CIcon class="ope-icon" name="icon-shanchubiaoge" isFont />
        </el-button>
      </el-tooltip>
      <el-tooltip effect="light" content="合并单元格" placement="left">
        <template #content>
          <InstructionPrompt title="合并单元格" />
        </template>
        <el-button class="menu-item-wrap" @click="editor.chain().focus().mergeCells().run()" :disabled="!editor.can().mergeCells()">
          <CIcon class="ope-icon" name="icon-hebingdanyuange" isFont />
        </el-button>
      </el-tooltip>
      <el-tooltip effect="light" content="取消合并" placement="left">
        <template #content>
          <InstructionPrompt title="取消合并" />
        </template>
        <el-button class="menu-item-wrap" @click="editor.chain().focus().splitCell().run()" :disabled="!editor.can().splitCell()">
          <CIcon class="ope-icon" name="icon-quxiaohebingdanyuange" isFont />
        </el-button>
      </el-tooltip>
      <div class="split-line"></div>
    </template>
    <el-tooltip effect="light" content="清除格式" placement="left">
      <template #content>
        <InstructionPrompt title="清除格式" />
      </template>
      <el-button class="menu-item-wrap" @click="editor.chain().focus().unsetAllMarks().run()">
        <CIcon class="ope-icon" name="icon-qingchugeshi" isFont />
      </el-button>
    </el-tooltip>
    <el-tooltip effect="light" content="向后撤销" placement="left">
      <template #content>
        <InstructionPrompt title="向后撤销" :shortcut="['Mod', 'Z']" />
      </template>
      <el-button class="menu-item-wrap" @click="editor.chain().focus().undo().run()" :disabled="!editor.can().chain().focus().undo().run()">
        <CIcon class="ope-icon" name="icon-chexiaozuo" isFont />
      </el-button>
    </el-tooltip>
    <el-tooltip effect="light" content="向前撤销" placement="left">
      <template #content>
        <InstructionPrompt title="向前撤销" :shortcut="['Mod', 'Y']" />
      </template>
      <el-button class="menu-item-wrap" @click="editor.chain().focus().redo().run()" :disabled="!editor.can().chain().focus().redo().run()">
        <CIcon class="ope-icon" name="icon-chexiaoyou" isFont />
      </el-button>
    </el-tooltip>
<!--    <el-button class="menu-item-wrap" @click="editor.chain().focus().toggleHeaderColumn().run()" :disabled="!editor.can().toggleHeaderColumn()">
      toggleHeaderColumn
    </el-button>
    <el-button class="menu-item-wrap" @click="editor.chain().focus().toggleHeaderRow().run()" :disabled="!editor.can().toggleHeaderRow()">
      toggleHeaderRow
    </el-button>
    <el-button class="menu-item-wrap" @click="editor.chain().focus().toggleHeaderCell().run()" :disabled="!editor.can().toggleHeaderCell()">
      toggleHeaderCell
    </el-button>
    <el-button class="menu-item-wrap" @click="editor.chain().focus().mergeOrSplit().run()" :disabled="!editor.can().mergeOrSplit()">
      mergeOrSplit
    </el-button>-->
<!--    <el-button class="menu-item-wrap" @click="editor.chain().focus().setCellAttribute('backgroundColor', '#FAF594').run()" :disabled="!editor.can().setCellAttribute('backgroundColor', '#FAF594')">
      setCellAttribute
    </el-button>-->
<!--    <el-button class="menu-item-wrap" @click="editor.chain().focus().fixTables().run()" :disabled="!editor.can().fixTables()">
      fixTables
    </el-button>
    <el-button class="menu-item-wrap" @click="editor.chain().focus().goToNextCell().run()" :disabled="!editor.can().goToNextCell()">
      goToNextCell
    </el-button>
    <el-button class="menu-item-wrap" @click="editor.chain().focus().goToPreviousCell().run()" :disabled="!editor.can().goToPreviousCell()">
      goToPreviousCell
    </el-button>-->
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
    shouldShow({ editor, view, state, oldState, from, to }) {
      const isTableActive = editor.isActive('table');
      console.log('editor.isActive(\'table\')', editor.isActive('table'))
     return isTableActive;
    },
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
  box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
  background: #fff;
  padding: 10px;
  border-radius: 5px;
  color: #666;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  flex-direction: column;
}
.menu-item-wrap {
  padding: 0;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: solid 1px #888888;
  margin: 0;
  .ope-icon{
    font-size: 13px;
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
  height: 1px;
  width: 20px;
  background: #dedede;
}

.inline-menu-item-wrap {
  padding: 6px 8px;
  white-space: nowrap;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  position: relative;
  align-items: center;
  display: flex;
  color: #666;
  .icon {
    margin-right: 4px;
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
  span{
    font-size: 13px;
  }
}
</style>
<style lang="scss">

</style>
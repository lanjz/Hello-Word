<template>
  <div v-if="editor">
    <InlineMenu :editor="editor"  />
    <floating-menu
        ref="InlineMenu"
        :tippy-options="{
          duration: 100,
          offset: [-50, 0],
          maxWidth: 'none',
          popperOptions: { placement: 'top-start' },
      }"
        pluginKey="textMenu"
        :editor="editor"
    >
      <QuickMenu :editor="editor" />
    </floating-menu>
    <div class="nodes-menu-wrap">
      <ToolMenu ref="tableMenuRef" :editor="editor" v-if="editor" />
    </div>
  </div>
  <editor-content :editor="editor" />
</template>
<script>
import {
  BubbleMenu,
  Editor,
  EditorContent,
  FloatingMenu,
} from '@tiptap/vue-3'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Document from '@tiptap/extension-document'
import Dropcursor from '@tiptap/extension-dropcursor'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import FontFamily from '@tiptap/extension-font-family';
import TextStyle from '@tiptap/extension-text-style'
import TextAlign from '@tiptap/extension-text-align'
import Color from '@tiptap/extension-color'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Placeholder from '@tiptap/extension-placeholder'
import Code from '@tiptap/extension-code'
import Typography from '@tiptap/extension-typography'
import Underline from '@tiptap/extension-underline'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import { FontSize} from './extends/FontSize'
import { ColorHighlighter } from './ColorHighlighter'
import { SmilieReplacer } from './SmilieReplacer'
import InlineMenu from './comps/InlineMenu.vue'
import QuickMenu from './comps/QuickMenu.vue'
import ToolMenu from './comps/ToolMenu.vue'

const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      // extend the existing attributes …
      ...this.parent?.(),

      // and add a new one …
      backgroundColor: {
        default: null,
        parseHTML: element => element.getAttribute('data-background-color'),
        renderHTML: attributes => {
          return {
            'data-background-color': attributes.backgroundColor,
            style: `background-color: ${attributes.backgroundColor}`,
          }
        },
      },
    }
  },
})
export default {
  components: {
    EditorContent,
    InlineMenu,
    QuickMenu,
    FloatingMenu,
    ToolMenu,
  },
  data() {
    return {
      editor: null,
      showTableMenu: false,
      tableMenuX: 0,
      tableMenuY: 0
    }
  },
  methods: {
    // 配置悬浮按钮的选项
    shouldShow: (view, node) => {
      console.log('view', view, node)
      // 这里可以根据需要自定义显示逻辑
      // 返回 true 表示始终显示 BubbleMenu
      return true;
    },
    handleClickOutside(event) {
      // 获取弹层 DOM 元素的引用
      const popup = this.$refs.tableMenuRef.$el;
      console.log('popup', popup)
      // 检查点击事件的目标元素是否在弹层内
      if (popup && !popup.contains(event.target)) {
        // 如果点击事件的目标不在弹层内，则关闭弹层
        this.showTableMenu = false;
      }
    },
    handleRightClick(event) {
      event.stopPropagation()
      event.preventDefault(); // 阻止默认的右键菜单
      const {clientX, clientY} = event;
      // 使用 TipTap 的 API 获取点击位置的 ProseMirror 位置
      const pos = this.editor.view.posAtCoords({left: clientX, top: clientY});
      if (pos) {
        const resolvedPos = this.editor.view.state.doc.resolve(pos.pos);
        // 检查点击是否发生在表格节点内
        let insideTable = false;
        for (let i = resolvedPos.depth; i > 0; i--) {
          const node = resolvedPos.node(i);
          if (node.type.name === 'table') {
            insideTable = true;
            break;
          }
        }
        if (insideTable) {
          this.showTableMenu = true
          this.tableMenuX = clientX
          this.tableMenuY = clientY
        } else {
          this.showTableMenu = false
        }
      }
    },
    addLisEvent() {
      // document.addEventListener('click', this.handleClickOutside)
      // document.addEventListener('contextmenu', this.handleClickOutside)
      // this.editor.view.dom.addEventListener('contextmenu', this.handleRightClick);
    }
  },
  mounted() {
    this.editor = new Editor({
      content: `
             <h2>
          Hi there,
        </h2>
           <ul data-type="taskList">
          <li data-type="taskItem" data-checked="true">flour</li>
          <li data-type="taskItem" data-checked="true">baking powder</li>
          <li data-type="taskItem" data-checked="true">salt</li>
          <li data-type="taskItem" data-checked="false">sugar</li>
          <li data-type="taskItem" data-checked="false">milk</li>
          <li data-type="taskItem" data-checked="false">eggs</li>
          <li data-type="taskItem" data-checked="false">butter</li>
        </ul>
           <p>
          You can also teach the editor new things. For example to recognize hex colors and add a color swatch on the fly: #FFF, #0D0D0D, #616161, #A975FF, #FB5151, #FD9170, #FFCB6B, #68CEF8, #80cbc4, #9DEF8F
        </p>
        <pre><code class="language-css">body {
  display: none;
}</code></pre>
        <p>
          I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
        </p>
        <blockquote>
          Wow, that’s amazing. Good work, boy! 👏
          <br />
          — Mom
        </blockquote>
      `,
      extensions: [
        StarterKit,
        Table.configure({
          resizable: true,
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Highlight.configure({ multicolor: true }),
        TableRow,
        TableHeader,
        // Default TableCell
        // TableCell,
        // Custom TableCell with backgroundColor attribute
        CustomTableCell,
        Document,
        Paragraph,
        Text,
        Image,
        Link.configure({
          openOnClick: false,
        }),
        Dropcursor,
        TaskList,
        TaskItem.extend({
          content: 'inline*',
          // nested: true,
        }),
        Placeholder.configure({
          placeholder: ({ node }) => {
            if (node.type.name === 'heading') {
              return 'What’s the title?'
            }

            return 'Can you add some further context?'
          },
        }),
        Typography,
        Underline,
        Subscript,
        Superscript,
        Code,
        ColorHighlighter,
        SmilieReplacer,
        TextStyle,
        Color,
        FontFamily,
        FontSize,
      ],
    })
    this.addLisEvent()
  },
  beforeDestroy() {
    // document.removeEventListener('click', this.handleClickOutside);
    // document.removeEventListener('contextmenu', this.handleClickOutside);
    // this.editor.view.dom.removeEventListener('contextmenu', this.handleRightClick);
    this.editor.destroy();
  },
}
</script>

<style lang="scss">
/* Basic editor styles */
.tiptap {
  > * + * {
    margin-top: 0.75em;
  }

  ul,
  ol {
    padding: 0 1rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    background: #0D0D0D;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0D0D0D, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0D0D0D, 0.1);
    margin: 2rem 0;
  }
}

/* Table-specific styling */
.tiptap {
  table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin: 0;
    overflow: hidden;

    td,
    th {
      min-width: 1em;
      border: 2px solid #ced4da;
      padding: 3px 5px;
      vertical-align: top;
      box-sizing: border-box;
      position: relative;

      > * {
        margin-bottom: 0;
      }
    }

    th {
      font-weight: bold;
      text-align: left;
      background-color: #f1f3f5;
    }

    .selectedCell:after {
      z-index: 2;
      position: absolute;
      content: "";
      left: 0; right: 0; top: 0; bottom: 0;
      background: rgba(200, 200, 255, 0.4);
      pointer-events: none;
    }

    .column-resize-handle {
      position: absolute;
      right: -2px;
      top: 0;
      bottom: -2px;
      width: 4px;
      background-color: #adf;
      pointer-events: none;
    }

    p {
      margin: 0;
    }
  }
}

.tableWrapper {
  overflow-x: auto;
}

.resize-cursor {
  cursor: ew-resize;
  cursor: col-resize;
}
</style>

<style lang="scss">
ul[data-type="taskList"] {
  list-style: none;
  padding: 0;

  li {
    display: flex;
    align-items: center;

    > label {
      flex: 0 0 auto;
      margin-right: 0.5rem;
      user-select: none;
    }

    > div {
      flex: 1 1 auto;
    }
  }

  input[type="checkbox"] {
    cursor: pointer;
  }
}
.tiptap .is-empty::before {
  content: attr(data-placeholder);
  float: left;
  color: #ced4da;
  pointer-events: none;
  height: 0;
}

.color {
  white-space: nowrap;

  &::before {
    content: ' ';
    display: inline-block;
    width: 1em;
    height: 1em;
    border: 1px solid rgba(128, 128, 128, 0.3);
    vertical-align: middle;
    margin-right: 0.1em;
    margin-bottom: 0.15em;
    border-radius: 2px;
    background-color: var(--color);
  }
}
.nodes-menu-wrap{
  position: fixed;
  z-index: 22;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  max-height: 60%;
  background: rgba(255,255,255,.7);
}
</style>
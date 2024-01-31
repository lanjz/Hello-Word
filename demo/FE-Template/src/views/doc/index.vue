<template>
  <div v-if="editor">
    <div>
      <h2>格式</h2>
      <div>
        <button @click="editor.chain().focus().toggleHighlight().run()" :class="{ 'is-active': editor.isActive('highlight') }">
          highlight
        </button>
        <button @click="editor.chain().focus().setTextAlign('left').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }">
          left
        </button>
        <button @click="editor.chain().focus().setTextAlign('center').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }">
          center
        </button>
        <button @click="editor.chain().focus().setTextAlign('right').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }">
          right
        </button>
        <button @click="editor.chain().focus().setTextAlign('justify').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }">
          justify
        </button>
      </div>
    </div>
    <div>
      <h2>图片</h2>
      <div>
        <button @click="addImage">add image from URL</button>
      </div>
    </div>
    <div>
      <h2>表格</h2>
      <div>
        <button @click="editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()">
          insertTable
        </button>
        <button @click="editor.chain().focus().addColumnBefore().run()" :disabled="!editor.can().addColumnBefore()">
          addColumnBefore
        </button>
        <button @click="editor.chain().focus().addColumnAfter().run()" :disabled="!editor.can().addColumnAfter()">
          addColumnAfter
        </button>
        <button @click="editor.chain().focus().deleteColumn().run()" :disabled="!editor.can().deleteColumn()">
          deleteColumn
        </button>
        <button @click="editor.chain().focus().addRowBefore().run()" :disabled="!editor.can().addRowBefore()">
          addRowBefore
        </button>
        <button @click="editor.chain().focus().addRowAfter().run()" :disabled="!editor.can().addRowAfter()">
          addRowAfter
        </button>
        <button @click="editor.chain().focus().deleteRow().run()" :disabled="!editor.can().deleteRow()">
          deleteRow
        </button>
        <button @click="editor.chain().focus().deleteTable().run()" :disabled="!editor.can().deleteTable()">
          deleteTable
        </button>
        <button @click="editor.chain().focus().mergeCells().run()" :disabled="!editor.can().mergeCells()">
          mergeCells
        </button>
        <button @click="editor.chain().focus().splitCell().run()" :disabled="!editor.can().splitCell()">
          splitCell
        </button>
        <button @click="editor.chain().focus().toggleHeaderColumn().run()" :disabled="!editor.can().toggleHeaderColumn()">
          toggleHeaderColumn
        </button>
        <button @click="editor.chain().focus().toggleHeaderRow().run()" :disabled="!editor.can().toggleHeaderRow()">
          toggleHeaderRow
        </button>
        <button @click="editor.chain().focus().toggleHeaderCell().run()" :disabled="!editor.can().toggleHeaderCell()">
          toggleHeaderCell
        </button>
        <button @click="editor.chain().focus().mergeOrSplit().run()" :disabled="!editor.can().mergeOrSplit()">
          mergeOrSplit
        </button>
        <button @click="editor.chain().focus().setCellAttribute('backgroundColor', '#FAF594').run()" :disabled="!editor.can().setCellAttribute('backgroundColor', '#FAF594')">
          setCellAttribute
        </button>
        <button @click="editor.chain().focus().fixTables().run()" :disabled="!editor.can().fixTables()">
          fixTables
        </button>
        <button @click="editor.chain().focus().goToNextCell().run()" :disabled="!editor.can().goToNextCell()">
          goToNextCell
        </button>
        <button @click="editor.chain().focus().goToPreviousCell().run()" :disabled="!editor.can().goToPreviousCell()">
          goToPreviousCell
        </button>
      </div>
    </div>
    <InlineMenu :editor="editor" />
    <floating-menu
        class="floating-menu"
        :tippy-options="{ duration: 100, trigger: 'mouseenter focus', placement: 'top-start' }"
        :editor="editor"
    >
      <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
        H1
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
        H2
      </button>
      <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
        Bullet List
      </button>
    </floating-menu>

   <div>
     <button @click="editor.chain().focus().toggleBold().run()" :disabled="!editor.can().chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
       bold
     </button>
     <button @click="editor.chain().focus().toggleItalic().run()" :disabled="!editor.can().chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
       italic
     </button>
     <button @click="editor.chain().focus().toggleStrike().run()" :disabled="!editor.can().chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
       strike
     </button>

     <button @click="editor.chain().focus().unsetAllMarks().run()">
       clear marks
     </button>
     <button @click="editor.chain().focus().clearNodes().run()">
       clear nodes
     </button>
     <button @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }">
       paragraph
     </button>
     <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
       h1
     </button>
     <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
       h2
     </button>
     <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
       h3
     </button>
     <button @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">
       h4
     </button>
     <button @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">
       h5
     </button>
     <button @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">
       h6
     </button>
     <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
       bullet list
     </button>
     <button @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">
       ordered list
     </button>

     <button @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }">
       blockquote
     </button>


     <button @click="editor.chain().focus().undo().run()" :disabled="!editor.can().chain().focus().undo().run()">
       undo
     </button>
     <button @click="editor.chain().focus().redo().run()" :disabled="!editor.can().chain().focus().redo().run()">
       redo
     </button>
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
import InlineMenu from './inline-menu.vue'


const CustomDocument = Document.extend({
  content: 'taskList',
})

const CustomTaskItem = TaskItem.extend({
  content: 'inline*',
})


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
    FloatingMenu,
  },
  data() {
    return {
      editor: null
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
    addImage() {
      const url = window.prompt('URL')

      if (url) {
        this.editor.chain().focus().setImage({ src: url }).run()
      }
    },
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
        CustomTaskItem,
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
        FontSize
      ],
    })
  }
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



.floating-menu {
  display: flex;
  background-color: #0D0D0D10;
  padding: 0.2rem;
  border-radius: 0.5rem;

  button {
    border: none;
    background: none;
    font-size: 0.85rem;
    font-weight: 500;
    padding: 0 0.2rem;
    opacity: 0.6;

    &:hover,
    &.is-active {
      opacity: 1;
    }
  }
}
</style>
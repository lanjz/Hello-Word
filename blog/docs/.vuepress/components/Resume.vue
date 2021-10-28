<template>
  <div class="full-page code-mirror markdown-layout">
    <div class="" :class="{'hideSplit': editMode !== 3}">
      <div class="flex relative" v-if="isEdit">
        <!--        <img src="../assets/imgs/IMG_0804的副本.JPG" alt="" class="avatar">-->
        <div class="flex-1">
          <textarea class="markdown-edit-box box-shadow-inset" v-model="markDownValueLeft"></textarea>
        </div>
        <div class="flex-1">
          <textarea class="markdown-edit-box box-shadow-inset" v-model="markDownValue"></textarea>
        </div>
      </div>
      <div class="md-body-layout edit-layout relative">
        <div class="markdown-operate-layout">
          <div class="icon-layout" @click="toggleEdit" :class="{'act': isEdit}">隐藏</div>
        </div>
        <div class="markdown-style left">
          <div class="markdown-content-style" v-html="leftMarkdownHTML"></div>
        </div>
        <div class="markdown-style flex-1">
          <div class="markdown-content-style" v-html="markdownHTML"></div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import marked from 'marked'
  import hljs from 'highlight.js'

  const renderer = new marked.Renderer()
  marked.setOptions({
    renderer,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    highlight: function (code) {
      return hljs.highlightAuto(code).value;
    }
  });

  function DIYMarked(text) {
    const result = text
      .replace(/C\(N\)/g, '<span class="marked-checkBox"></span>')
      .replace(/C\(Y\)/g, '<span class="marked-checkBox"><i class="iconfont icon-gou1"></i></span>')
      .replace(/\((.*?)\)\?(\((.*?)\))?/g, function ($1, $2, $3, $4) {
        if($4) {
          return `<div class="marked-issue">${$2}<i class="iconfont icon-wenhao color"> <span class="marked-issue-tip">${$4}</span></i> </div>`
        }
        return `<div class="marked-issue">${$2}<i class="iconfont icon-wenhao"></i></div>`
      })
      .replace(/(<a .*?<\/a>)/g, function ($1, $2, $3, $4) {
        return `${$2}<span class="marked-iconfont-link">(<i class="iconfont icon-lianjie2"></i>)</span>`
      })
    return result
  }

  export default {
    data() {
      return {
        split: 0.5,
        markDownValue: '',
        markDownValueLeft: '',
        editMode: 1, // 编辑模式
        isEdit: true,
        isPreview: true,
        markdownHTML: '',
        leftMarkdownHTML: '',
      }
    },
    watch: {
      markDownValue: function (val) {
        if(this.isPreview) {
          clearTimeout(this.timeOut)
          this.timeOut = setTimeout(() => {
            this.markdownHTML = DIYMarked(marked(val))
          }, 500)
        }
      },
      markDownValueLeft: function (val) {
        if(this.isPreview) {
          clearTimeout(this.timeOut)
          this.timeOut = setTimeout(() => {
            this.leftMarkdownHTML = DIYMarked(marked(val))
          }, 500)
        }
      },
    },
    methods: {
      toggleEdit() {
        this.isEdit = !this.isEdit
        if(!this.isEdit) {
          this.isPreview = true
        }
      },
      togglePreview() {
        this.isPreview = !this.isPreview
        if(!this.isPreview) {
          this.isEdit = true
        }
      }
    },
    mounted() {
      this.markDownValue = ''
    }
  }
</script>
<style scoped>
  .flex {
    display: flex;
  }

  .flex-1 {
    flex: 1;
  }

  .full-page {
    position: fixed;
    z-index: 999;
    width: 100%;
    left: 0;
    top: 0;
    margin: 0 !important;
    padding: 0 !important;
  }

  .avatar {
    width: 100px;
    right: 20px;
    top: 20px;
    position: absolute;
    z-index: 1;
  }

  .edit-layout:hover .markdown-operate-layout {
    display: block;
  }

  .showCompileMarkdownBox, #codeMirror {
    width: 100%;
    height: 100%;
  }

  .code-mirror .demo-split-pane {
    padding: 10px;
    overflow: auto;
  }

  .code-mirror .showCompileMarkdownBox {
    padding: 0 7px;
    overflow: auto;
    word-break: break-all;
  }

  .code-mirror .ivu-split-horizontal {
    height: 100%;
  }

  .code-mirror .code-mirror-tags {
    background: #202020;
    position: relative;
  }

  .code-mirror .tags-item {
    border-bottom: 1px solid #fff;
    position: relative;
    display: inline-block;
    padding: 12px 15px;
    cursor: pointer;
  }

  .code-mirror .tags-item.act {
    color: #515a6e;
    background: #fff;
    z-index: 2;
  }

  .code-mirror .tags-item:hover {
    color: #000;
  }

  .code-mirror .tags-item-2 {
    display: inline-block;
    float: right;
    cursor: pointer;
  }

  .code-mirror .tags-item-2.act {
    background: #313131;
    color: #fff;
  }

  .code-mirror .code-mirror-tags:after {
    content: '';
    height: 1px;
    background: #e1e4e8;
    position: absolute;
    width: 100%;
    left: 0;
    z-index: 1;
    bottom: 0;
  }

  .code-mirror.markdown-layout .markdown-edit-box {
    width: 100%;
    min-height: 500px;
    height: 100%;
    overflow: auto;
    padding: 20px;
    background: #202020;
    color: #919191;
    border: none;
    outline: none;
    font-size: 14px;
  }

  .code-mirror.markdown-layout .md-body-layout {
    overflow: auto;
    background: #fff;
    padding: 0;
    box-shadow: 0 0 4px 1px #e7eaef inset;
  }

  .code-mirror.markdown-layout .markdown-operate-layout {
    display: none;
    position: absolute;
    z-index: 2;
    right: 20px;
    top: 10px;
    color: #fff;

  }

  .code-mirror.markdown-layout .icon-layout {
    display: inline-block;
    background: rgba(0, 0, 0, 0.7);
    padding: 3px 5px;
    cursor: pointer;
    border-radius: 3px;
    text-align: center;

  }

  .code-mirror.markdown-layout .icon-layout.act {
    background: rgba(57, 141, 238, 0.7);
  }
</style>

<style scoped>
  a {
    color: inherit;
    text-decoration: none;
  }

  .markdown-style.left {
    background: #202020;
    color: #919191;
  }

  .markdown-style.left li {
    margin: 15px 0;
  }

  .markdown-style.left h1 {
    margin-top: 20px;
  }

  .markdown-style.left .markdown-content-style > h1 {
    margin-top: 20px;
  }

  .markdown-style h1:before, .markdown-style h2:before {
    content: '';
    margin-top: 0;
    display: block;
    height: auto;
  }

  .markdown-content-style > h1 {
    margin-top: 20px;
  }

  .markdown-style h1 {
    font-size: 18px;
  }

  .markdown-style h2 {
    font-size: 15px;
  }

  .markdown-style h3 {
    font-size: 14px;
  }

  .markdown-style p {
    margin: 6px auto;
    font-size: 12px;
  }

  .markdown-style h1:after {
    content: 'H1';
    bottom: 6px;
  }

  .markdown-style h2:after {
    content: 'H2';
    bottom: 3px;
  }

  .markdown-style h3:after {
    content: 'H3';
    bottom: 1px;
  }

  .markdown-style ul, .markdown-style ol {
    margin-top: 0;
  }

  strong {
    font-size: 13px;
    margin-top: 10px;
    display: inline-block;
  }
</style>
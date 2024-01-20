<template>
  <div class="doc-wrap">
    <div class="intro" v-if="!props.hideIntro"><span>说明</span></div>
    <div class="md-container" v-html="mdIt.render(props.md)"></div>
  </div>
</template>

<script setup lang="ts">
import hljs from 'highlight.js'
import MarkdownIt from 'markdown-it'
import { defineProps } from 'vue'
const props = defineProps(['md', 'hideIntro'])
const mdIt = new MarkdownIt()
setTimeout(() => {
  const blocks = document.querySelectorAll('pre code:not(.hljs)')
  Array.prototype.forEach.call(blocks, hljs.highlightBlock)
})
</script>

<style lang="scss" scoped>
.intro {
  position: relative;
  text-align: center;
  span {
    background: #fff;
    position: relative;
    z-index: 1;
    display: inline-block;
    padding: 0 20px;
    font-weight: bold;
    font-size: 30px;
  }
  &:after {
    content: '';
    display: block;
    position: absolute;
    height: 2px;
    width: 100%;
    left: 0;
    top: 50%;
    background: #19caad;
  }
}
.doc-wrap {
  padding: 20px 40px;
  border-radius: 4px;
  background: #fff;
  margin-top: 20px;
}
</style>
<style lang="scss">
.md-container {
  box-sizing: border-box;
  height: 100%;
  code:not(.hljs) {
    background: #f3ede9;
    padding: 2px 4px;
    border-radius: 1px;
  }
  ol {
    padding: 0 1rem;
  }
  pre {
    line-height: 28px;
  }
  h2 {
    font-size: 28px;
    color: #1f2d3d;
    margin: 0;
    margin-top: 30px;
  }
  h3 {
    font-size: 22px;
  }
  h2,
  h3,
  h4,
  h5 {
    font-weight: normal;
    color: #1f2f3d;

    &:hover a {
      opacity: 0.4;
    }

    a {
      float: left;
      margin-left: -20px;
      opacity: 0;
      cursor: pointer;

      &:hover {
        opacity: 0.4;
      }
    }
  }

  p {
    font-size: 14px;
    color: #5e6d82;
    line-height: 1.5em;
  }

  .tip {
    padding: 8px 16px;
    background-color: #ecf8ff;
    border-radius: 4px;
    border-left: #50bfff 5px solid;
    margin: 20px 0;

    code {
      background-color: rgba(255, 255, 255, 0.7);
      color: #445368;
    }
  }

  .warning {
    padding: 8px 16px;
    background-color: #fff6f7;
    border-radius: 4px;
    border-left: #fe6c6f 5px solid;
    margin: 20px 0;

    code {
      background-color: rgba(255, 255, 255, 0.7);
      color: #445368;
    }
  }
  h3 {
    margin: 20px 0 20px;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    background-color: #fff;
    font-size: 14px;
    margin-bottom: 45px;
    line-height: 1.5em;

    strong {
      font-weight: normal;
    }

    td,
    th {
      border-bottom: 1px solid #dcdfe6;
      padding: 15px;
      max-width: 250px;
    }

    th {
      text-align: left;
      white-space: nowrap;
      color: #909399;
      font-weight: normal;
    }

    td {
      color: #606266;
    }

    th:first-child,
    td:first-child {
      padding-left: 10px;
    }
  }

  ul:not(.timeline) {
    margin: 10px 0;
    padding: 0 0 0 20px;
    font-size: 14px;
    color: #5e6d82;
    line-height: 2em;
  }
}
</style>

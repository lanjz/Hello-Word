<template>
  <div class="code-mirror markdown-layout resume-page">
    <div class="" :class="{'hideSplit': editMode !== 3}">
      <div class="relative" v-if="isEdit">
        <!--        <img src="../assets/imgs/IMG_0804的副本.JPG" alt="" class="avatar">-->
<!--        <div class="flex-1">
          <textarea class="markdown-edit-box box-shadow-inset" v-model="markDownValueLeft"></textarea>
        </div>-->
        <div class="">
          <textarea class="markdown-edit-box box-shadow-inset" placeholder="输入MD内容" v-model="markDownValue"></textarea>
        </div>
      </div>
      <div class="md-body-layout edit-layout relative" v-if="!!markdownHTML">
        <div class="markdown-operate-layout">
          <div class="icon-layout" @click="toggleEdit" :class="{'act': isEdit}"><i class="iconfont icon-bianji2"></i></div>
        </div>
<!--        <div class="markdown-style left">
          <div class="markdown-content-style" v-html="leftMarkdownHTML"></div>
        </div>-->
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
<style>
.resume-page *{
  position: relative;
}
.resume-page{
  color: #000;
}
.resume-page .markdown-style h1:after, .resume-page .markdown-style h2:after, .resume-page .markdown-style h3:after, .resume-page .markdown-style h4:after, .resume-page .markdown-style h5:after, .resume-page .markdown-style h6:after {
  color: #d6d5d5;
  font-size: 15px;
  font-weight: normal;
  position: absolute;
  left: -30px;
  bottom: 0;
}
.resume-page .navbar{
  display: none;
}
.resume-page .theme-default-content:not(.custom) {
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
}
.resume-page .page{
  padding: 0 !important;
}
.resume-page .theme-default-content:not(.custom) > *:first-child{
  margin: 0 !important;
}
.resume-page .page-edit{
  display: none;
}
</style>
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

  .edit-layout{
    position: relative;
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
    box-sizing: border-box;
    font-size: 14px;
  }
  .box-shadow-inset{
    /*box-shadow: 0 0 4px 1px #000 inset*/
  }
  .code-mirror.markdown-layout .md-body-layout {
    overflow: auto;
    background: #fff;
    padding: 0;
  }

  .markdown-operate-layout {
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

<style>
  .resume-page a {
    color: inherit;
    text-decoration: none;
  }

  .resume-page .markdown-style.left {
    background: #202020;
    color: #919191;
  }

  .resume-page .markdown-style.left li {
    margin: 15px 0;
  }

  .resume-page .markdown-style.left h1 {
    margin-top: 20px;
  }
  .resume-page .markdown-content-style{
    padding: 10px 20px 20px 50px;
    min-height: 100%;
  }
  .resume-page .markdown-style.left .markdown-content-style > h1 {
    margin-top: 20px;
  }

  .resume-page .markdown-style h1:before, .resume-page .markdown-style h2:before {
    content: '';
    margin-top: 0;
    display: block;
    height: auto;
  }

  .resume-page .markdown-content-style > h1 {
    margin-top: 20px;
  }

  .resume-page .markdown-style h1 {
    font-size: 18px;
  }

  .resume-page .markdown-style h2 {
    font-size: 15px;
    border: none;
  }

  .resume-page .markdown-style h3 {
    font-size: 14px;
  }

  .resume-page .markdown-style p {
    margin: 6px auto;
    font-size: 12px;
  }

  .resume-page .markdown-style h1:after {
    content: 'H1';
    bottom: 3px;
  }

  .resume-page .markdown-style h2:after {
    content: 'H2';
    bottom: 6px;
  }

  .resume-page .markdown-style h3:after {
    content: 'H3';
    bottom: 1px;
  }

  .resume-page .markdown-style ul, .resume-page .markdown-style ol {
    margin-top: 0;
  }

  .resume-page strong {
    font-size: 13px;
    margin-top: 0px;
    display: inline-block;
  }
</style>
<style>
@font-face {font-family: "iconfont";
  src: url('//at.alicdn.com/t/font_992689_xpg7lvpyl88.eot?t=1562749985499'); /* IE9 */
  src: url('//at.alicdn.com/t/font_992689_xpg7lvpyl88.eot?t=1562749985499#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2'),
  url('//at.alicdn.com/t/font_992689_xpg7lvpyl88.woff?t=1562749985499') format('woff'),
  url('//at.alicdn.com/t/font_992689_xpg7lvpyl88.ttf?t=1562749985499') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
  url('//at.alicdn.com/t/font_992689_xpg7lvpyl88.svg?t=1562749985499#iconfont') format('svg'); /* iOS 4.1- */
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  top: 2px;
}

.icon-list:before {
  content: "\e60b";
}

.icon-biji:before {
  content: "\e625";
}

.icon-gou1:before {
  content: "\e60c";
}

.icon-lianjie:before {
  content: "\e65b";
}

.icon-lianjie1:before {
  content: "\e62a";
}

.icon-books:before {
  content: "\e603";
}

.icon-sousuo:before {
  content: "\e687";
}

.icon-wenjianjiafolder81:before {
  content: "\e744";
}

.icon-jingdian:before {
  content: "\e645";
}

.icon-shanchu:before {
  content: "\e68e";
}

.icon-bianji2:before {
  content: "\e72a";
}

.icon-tianjiajiahaowubiankuang:before {
  content: "\e81a";
}

.icon-liebiao3:before {
  content: "\e646";
}

.icon-liebiao6:before {
  content: "\e64a";
}

.icon-liebiao8:before {
  content: "\e64b";
}

.icon-iconzuijingengxin:before {
  content: "\e64c";
}

.icon-zuoye:before {
  content: "\e650";
}

.icon-wenjianjia1:before {
  content: "\e606";
}

.icon-bold:before {
  content: "\e6d9";
}

.icon-resume-list-checklist-detail-note-paper-biodata-profile-office-beeadf:before {
  content: "\e781";
}

.icon-dakaiwenjian:before {
  content: "\e607";
}

.icon-yulan:before {
  content: "\e7b9";
}

.icon-lianjie2:before {
  content: "\e6c7";
}

.icon-paixu:before {
  content: "\e66e";
}

.icon-wendangsousuo:before {
  content: "\e76d";
}

.icon-notebook__eas:before {
  content: "\e600";
}

.icon-bianji:before {
  content: "\e649";
}

.icon-wushuju:before {
  content: "\e642";
}

.icon-zuoye1:before {
  content: "\e635";
}

.icon-bianji1:before {
  content: "\e604";
}

.icon-jiaoya_fuzhi:before {
  content: "\e63e";
}

.icon-wenjiansudi:before {
  content: "\e65a";
}

.icon-neirong:before {
  content: "\e68c";
}

.icon-shuji:before {
  content: "\e696";
}

.icon-wenjianjia:before {
  content: "\e608";
}

.icon-wendang:before {
  content: "\e60a";
}

.icon-icon_:before {
  content: "\e6c6";
}

.icon-tubiaozhizuomoban:before {
  content: "\e610";
}

.icon-wenjianjia3:before {
  content: "\e6dd";
}

.icon-xiaoyuan-:before {
  content: "\e613";
}

.icon-wenjian1:before {
  content: "\e638";
}

.icon-wenjian2:before {
  content: "\e648";
}

.icon-wenjian:before {
  content: "\e633";
}

.icon-xianbanshense-:before {
  content: "\e622";
}

.icon-wenjianjia2:before {
  content: "\e619";
}

.icon-wenjian-:before {
  content: "\e609";
}

.icon-JavaScript:before {
  content: "\e704";
}

.icon-wenjianjia-:before {
  content: "\e686";
}

.icon-wenhao:before {
  content: "\e64d";
}

.icon-wendangcaozuojilu:before {
  content: "\e644";
}

.icon-shanchu1:before {
  content: "\e68f";
}

.icon-wendang1:before {
  content: "\e66a";
}

.icon-wenjian3:before {
  content: "\e663";
}

.icon-wendang2:before {
  content: "\e75f";
}

.icon-bijiben:before {
  content: "\e618";
}

.icon-wenjianjia4:before {
  content: "\e79c";
}

.icon-ziduan:before {
  content: "\e63c";
}

.icon-shujia1:before {
  content: "\e602";
}

.icon-biji1:before {
  content: "\e60d";
}

.icon--shujia:before {
  content: "\e615";
}

.icon-tianjiawenjian:before {
  content: "\e664";
}

.icon-lianjie3:before {
  content: "\e651";
}

.icon-shujia:before {
  content: "\e601";
}

.icon-wenhao1:before {
  content: "\e693";
}

.icon-icon_shujianor:before {
  content: "\e605";
}

.icon-tuya-:before {
  content: "\e758";
}

.icon-wenjian4:before {
  content: "\e8d2";
}

.icon-wenhao2:before {
  content: "\e75d";
}


</style>
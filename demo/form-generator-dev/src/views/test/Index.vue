<template>
  <div class="full-wrap">
    <div class="el-list-wrap">
      <div v-for="(item, listIndex) in componentsList" :key="listIndex" class="component-box">
        <div class="components-class-title">
          <svg-icon icon-class="component" />
          {{ item.title }}
        </div>
        <draggable
          class="draggable-box"
          :list="item.list"
          :group="{ name: 'g1', pull: 'clone', put: false }"
          :clone="cloneComponent"
          draggable=".components-item"
          :sort="false"
          @end="onEnd"
        >
          <div
            v-for="(element, index) in item.list"
            :key="index"
            class="components-item"
            @click="addComponent(element)"
          >
            <div class="">
              <svg-icon icon-class="row" />
              {{ element.desc }}
            </div>
          </div>
        </draggable>
      </div>
    </div>
    <div class="preview-wrap">
      <components :is="previewWrap"></components>
    </div>
    <div class="setting-wrap">
      <configWrap :activityEl="activityEl" @updateValue="updateConfigValue"></configWrap>
    </div>
    <div class="meta-warp">
      <rawDisplayer class="col-3" :value="list" title="List" />
    </div>
  </div>
</template>

<script>
// import nestedDraggable from './infra/nested'
import rawDisplayer from './infra/raw-displayer'
import configWrap from './configWrap';
import { deepClone } from '../../utils/index'
import renderRoot, { renderView, renderDraggableView, wrapComps, inputComps } from './utils'

export default {
  name: 'nested-example',
  display: 'Nested',
  order: 15,
  components: {
    // nestedDraggable,
    rawDisplayer,
    configWrap
  },
  data() {
    return {
      list: [
/*        {
          tagName: 'div',
          childrenView: ['1']
        },
        {
          tagName: 'div',
          childrenView: [
            {
              tagName: 'div',
              childrenView: ['Freed']
            },
            {
              tagName: 'div',
              childrenView: ['Freed22']
            }
          ]
        },
        {
          tagName: 'div',
          childrenView: ['3']
        }*/
      ],
      componentsList: [
        {
          title: '基础组件',
          list: wrapComps
        },
        {
          title: '表单组件',
          list: inputComps
        }
      ],
      activityEl: undefined
    }
  },
  computed: {
    previewWrap() {
      const _this = this
      return {
        render(createElement) {
          return createElement(
            'draggable',
            {
              props: {
                tag: 'div',
                list: _this.list
              },
              attrs: {
                group: 'g1'
              },
              class: {
                'global-full-wrap': true
              }
            },
            _this.list.map(item => renderView(createElement, item, _this))
          )
        }
      }
    }
  },
  methods: {
    updateConfigValue(config) {
      this.activityEl.propsConfig = config
      this.list = [...this.list]
    },
    addComponent() {

    },
    cloneComponent(origin){
      // const clone = deepClone(origin)
      const clone = JSON.parse(JSON.stringify(origin))
      // const config = clone.__config__
      // config.span = this.formConf.span // 生成代码时，会根据span做精简判断
      // this.createIdAndKey(clone)
      // clone.placeholder !== undefined && (clone.placeholder += config.label)
      this.tempActiveDataST = clone
      return this.tempActiveDataST
    },
    onEnd(obj){
      console.log(obj)
/*      if (obj.from !== obj.to) {
        this.fetchData(tempActiveData)
        this.activeData = tempActiveData
        this.activeId = this.idGlobal
      }*/
    },
    handleFormPreviewEl(arg, e){
      this.activityEl = arg
      e.stopPropagation()
    }
  }

}
</script>
<style scoped lang="scss">
.group-wrap{
  padding: 20px;
  border: solid 1px #fff;
}
.group-item{
  padding: 20px;
  border: solid 1px red;
}
.full-wrap{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  background: #e5e5e5;
  padding: 8px;
}
.el-list-wrap{
  width: 350px;
  flex-shrink: 0;
  height: 100%;
  margin-right: 10px;
  overflow: auto;
  .component-box{

  }
  .components-class-title{
    padding: 10px;
    font-size: 15px;
    color: #000;
    background: #fff;
  }
  ::v-deep{
    .components-item{
      display: inline-block;
      width: 30%;
      background: #fff;
      color: #333;
      margin-left: 2.1%;
      border: solid 1px #999;
      height: 32px;
      line-height: 32px;
      text-align: center;
      font-size: 14px;
      margin-bottom: 8px;
      cursor: move;
    }
  }
  .draggable-box{
    padding-bottom: 10px;
    background: #fff;
    margin-bottom: 8px;
  }
}
.preview-wrap{
  flex: 1;
  overflow: auto;
/*  .components-item{
    width: 100%;
    background: red;
  }*/
}
.setting-wrap{
  width: 350px;
  flex-shrink: 0;
  height: 100%;
  margin-left: 10px;
  background: #fff;
  overflow: auto;
}
.meta-warp{
  width: 350px;
  flex-shrink: 0;
  height: 100%;
  margin-left: 10px;
  background: #fff;
  overflow: auto;
}
</style>

<style lang="scss">
*{
  box-sizing: border-box;
}
.global-full-wrap{
  height: 100%;
  border: dotted 1px #007acc;
  background: #f0f0f0;
  padding: 20px 10px;
}
.preview-wrap *{
  position: relative;
  .preview-component-desc{
    background: rgba(0,0,0,.5);
    left: 0;
    top: 0;
    font-size: 12px;
    color: #fff;
    display: inline-block;
    padding: 2px 5px;
    position: absolute;
    transform: translateY(-100%);
  }
  .draggable-wrap{
    background-image: url("./icon.png") !important;
    background-size: 25px auto !important;
  }
  .el-wrap{
    border: solid 1px transparent;
    &.is-activity, &:hover{
      border: dashed 1px #007acc;
    }
  }
}

</style>

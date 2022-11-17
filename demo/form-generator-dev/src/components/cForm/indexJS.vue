<template>
  <el-form
      ref="elForm"
      v-bind="$attrs"
      v-on="$listeners"
      :model="model"
      :class="['c-form', formClass]"
  >
    <slot>
      <template v-for="(item) in column">
        <FormItem
            :key="item.prop"
            :column="item"
            :form="model"
        />
      </template>
    </slot>
    <el-form-item v-if="!hideAction" :style="{'opacity': showAction ? 1: 0}" ref="action-item" label="" class="item-shrinkage" :labelWidth="isInline ? $attrs['label-width']: '0'">
      <div style="text-align: right; " :style="shrinkageBtnStyle">
        <div style="display: inline-block" ref="actionBox" class="action-container">
          <slot name="action">
            <el-button :loading="loading" class="has-icon" type="primary" @click="confirm">
              <span class="iconfont el-icon-search"></span>
              查询
            </el-button>
            <el-button :loading="loading" class="has-icon" @click="reset">
              <span class="iconfont el-icon-refresh-right"></span>重置</el-button>
          </slot>

          <div class="toggle-btn" @click="toggleOpen" v-if="isInline&&!keep">
            <span v-if="isOpen">收起 <i class="iconfont">&#xe738;</i></span>
            <span v-else>展开 <i class="iconfont">&#xe711;</i></span>
          </div>
        </div>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import FormItem from './FormItem'

export function rafThrottle(fn) {
  let locked = false;
  return function(...args) {
    if (locked) return;
    locked = true;
    window.requestAnimationFrame(() => {
      fn.apply(this, args);
      locked = false;
    });
  };
}

export default {
  name: 'cFormPanel',
  props: {
    model: {
      type: Object,
      default: () => ({})
    },
    formClass: {
      type: String,
      default: ''
    },
    column: {
      type: Array,
      default: () => ([])
    },
    keep: {
      type: Boolean,
      default: () => false
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    hideAction: {
      type: Boolean,
      default: () => false
    }
  },
  components: {
    FormItem
  },
  data(){
    return {
      rootForm: {},
      shrinkageBtnStyle: {},
      isOpen: true,
      lastLineNum: Infinity,
      lineMax: Infinity,
      showAction: false
    }
  },
  computed: {
    isInline(){
      return this.$attrs.hasOwnProperty('inline')
    }
  },
  methods: {
    confirm(){
      this.$emit('confirm')
    },
    reset(){
      this.$emit('reset')
    },
    validate(cb) {
      this.$refs.elForm.validate(cb);
    },
    validateField(props, cb) {
      this.$refs.elForm.validateField(props, cb);
    },
    resetFields() {
      this.$refs.elForm.resetFields();
    },
    clearValidate(props) {
      this.$refs.elForm.clearValidate(props);
    },
    setDefaultModel(column){
      column.forEach(item => {
        const { prop } = item
        if(prop&&!this.model.hasOwnProperty(prop)){
          this.$set(this.model, prop, undefined)
        }
        if(item.renderList&&item.renderList.length){
          this.setDefaultModel(item.renderList)
        }
      })
    },
    toggleOpen(){
      this.isOpen = !this.isOpen
      this.setShrinkage()
    },
    setShrinkage(){
      if(!this.isInline){
        return
      }
      this.$nextTick(() => {
        if(this.$refs.elForm){
          const { clientWidth } = this.$refs.elForm.$el
          let { width, marginRight } = window.getComputedStyle(this.$refs.elForm.$el.children[0])
          width = parseInt(width) + parseInt(marginRight) // 一个表单元素实际占用的空间大小
          let max = Math.floor(clientWidth/width) // 一行可显示的最大数量
          let lineMax = Math.max(max, 2)  // 一行的数量,至少显示一个+控制元素 = 2

          let len = this.$refs.elForm.$el.children.length
          for(let ind=0; ind<len; ind++){
            let item = this.$refs.elForm.$el.children[ind]
            if(item.className.indexOf('item-shrinkage')>-1){
              continue
            }
            let isShow =
                (!this.isOpen&&ind<(lineMax-1) || this.isOpen)
                &&(!this.column.length||!this.column[ind].show || this.column[ind].show(this.model))
            item.style.display = isShow ? 'block': 'none'
          }
          // 设置操作按钮
          if(this.$refs['action-item']){
            // 如果操作按钮独立占用了一行,设置transform
            let onlyOneLine = (clientWidth-20) <= this.$refs['action-item'].$el.clientWidth
            let rightDis = onlyOneLine ? (clientWidth - max*width) : 0
            this.shrinkageBtnStyle = {
              'transform': `translateX(${-rightDis}px`,
            }
            // 非单行下按钮的布局
            this.$refs['action-item'].$el.style['text-align'] = onlyOneLine ? 'right': 'left'
          }
        }
      })
    },
  },
  created() {
    this.onSize = rafThrottle(this.setShrinkage)
  },
  destroyed() {
    window.removeEventListener('resize', this.onSize)
  },
  mounted() {
    if(this.column&&this.column.length){
      this.setDefaultModel(this.column)
    }
    if(this.hideAction){
      return
    }
    this.setShrinkage()
    setTimeout(() => {
      // slot action  操作区域会有闪动，所以延迟显示
      this.showAction = true
      this.onSize()
    }, 150)
    window.addEventListener('resize', this.onSize)
  }
}
</script>

<style scoped lang="scss">
.toggle-btn{
  cursor: pointer;
  display: inline-block;
  line-height: 32px;
  color: #007acc;
  padding: 0 10px;
  margin-left: 10px;
}
.c-form.el-form--inline{
  display: flex;
  flex-wrap: wrap;
  ::v-deep{
    .el-form-item{
      flex-shrink: 0;
    }
    .item-shrinkage{
      flex-grow: 1;
      //min-width: 230px;
      text-align: right;
      padding-left: 20px;
    }
  }
}
::v-deep .action-container > div{
  display: inline-block;
}
</style>

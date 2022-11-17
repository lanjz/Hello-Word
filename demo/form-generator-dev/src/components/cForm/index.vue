<template>
  <el-form
      ref="elForm"
      v-bind="$attrs"
      v-on="$listeners"
      :model="model"
      :class="['c-form', formClass]"
      :style="{'height': showAction ? 'auto': '48px', 'overflow': 'hidden'}"
  >
    <slot>
      <template v-for="(item, ind) in column">
        <FormItem
            v-if="(!isOpen&&ind<(lineMax-1) || isOpen)&&(!item.show || item.show(model))"
            :key="item.prop"
            :column="item"
            :form="model"
        />
      </template>
    </slot>
    <el-form-item :style="{'opacity': showAction ? 1: 0}" ref="action-item" label="" class="item-shrinkage" :labelWidth="isInline ? $attrs['label-width']: '0'">
      <div style="text-align: right" :style="shrinkageBtnStyle">
        <div style="display: inline-block" ref="actionBox">
          <slot name="action">
            <el-button type="primary" @click="confirm">查询</el-button>
            <el-button @click="reset">重置</el-button>
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
import { EventBus } from '@/utils/help/index'
export default {
  name: "index",
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
    }
  },
  components: {
    FormItem
  },
  data(){
    return {
      rootForm: {},
      shrinkageBtnStyle: {},
      isOpen: false,
      lastLineNum: Infinity,
      lineMax: Infinity,
      showAction: false
    }
  },
  computed: {
    isInline(){
      return this.$attrs.inline
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
    setShrinkage2(){
      if(this.isWork) return
      this.isWork = true
      setTimeout(() => {
        this.$nextTick(() => {
          if(!this.$refs.elForm){
            this.isWork = false
            return
          }
          const { clientWidth } = this.$refs.elForm.$el
          let len = this.$refs.elForm.$el.children.length
          let { width, marginRight } = window.getComputedStyle(this.$refs.elForm.$el.children[0])
          width = parseInt(width) + parseInt(marginRight) // 一个表单元素实际占用的空间大小
          let max = Math.floor(clientWidth/width) // 一行可显示的最大数量
          this.lineMax = Math.max(max, 2)  // 一行的数量,至少显示一个+控制元素 = 2
          let lastLen = len%max // 是否刚好填满
          if(lastLen === 0){ // 刚好填满
            this.shrinkageBtnStyle = {
              width:1*width - parseInt(marginRight) + 'px'
            }
          } else {
            this.shrinkageBtnStyle = {
              width:(max-lastLen+1)*width - parseInt(marginRight) + 'px'
            }
          }
          this.isWork = false
        })
      },)
    },
    setShrinkage(){
      console.log('setShrinkage')
      if(!this.isInline){
        return
      }
      this.$nextTick(() => {
        if(!this.$refs.elForm){
          return
        }
        const { clientWidth } = this.$refs.elForm.$el
        let { width, marginRight } = window.getComputedStyle(this.$refs.elForm.$el.children[0])
        width = parseInt(width) + parseInt(marginRight) // 一个表单元素实际占用的空间大小
        let max = Math.floor(clientWidth/width) // 一行可显示的最大数量
        this.lineMax = Math.max(max, 2)  // 一行的数量,至少显示一个+控制元素 = 2
/*        let rightDis = clientWidth - max*width
        this.shrinkageBtnStyle = {
          'transform': `translateX(${-rightDis}px`,
          'width': width + 'px',
        }*/
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
      })
    }
  },
  destroyed() {
    EventBus.$off('c-form-layout-update', this.setShrinkage)
    window.addEventListener('resize', this.setShrinkage)
  },
  mounted() {
    EventBus.$off('c-form-layout-update', this.setShrinkage)
    EventBus.$on('c-form-layout-update', this.setShrinkage)
    if(this.column&&this.column.length){
      this.setDefaultModel(this.column)
    }
    setTimeout(() => {
      this.showAction = true
      this.setShrinkage()
    }, 500)
    window.addEventListener('resize', this.setShrinkage)
  }
}
</script>

<style scoped lang="scss">
.toggle-btn{
  cursor: pointer;
  display: inline-block;
  line-height: 32px;
  color: $--color-primary;
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
</style>
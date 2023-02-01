<template>
  <el-form
      ref="elForm"
      v-bind="$attrs"
      v-on="$listeners"
      :model="model"
      :class="['c-form', formClass]"
  >
    <slot></slot>
    <el-form-item ref="action-item" label="" class="item-shrinkage" :labelWidth="isInline ? $attrs['label-width']: '0'">
      <div style="text-align: right" :style="shrinkageBtnStyle">
       <div style="display: inline-block" ref="actionBox">
         <slot name="action">
           <el-button type="primary">查询</el-button>
           <el-button >重置</el-button>
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
    keep: {
      type: Boolean,
      default: () => false
    }
  },
  data(){
    return {
      rootForm: {},
      shrinkageBtnStyle: {},
      isOpen: true,
      lastLineNum: Infinity,
      lineMax: Infinity,
    }
  },
  computed: {
    isInline(){
      return this.$attrs.inline
    }
  },
  methods: {
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
    toggleOpen(){
      this.isOpen = !this.isOpen
      this.setShrinkage()
    },
    setShrinkage(){
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
        if(this.$refs['action-item']){
          // 如果操作按钮独立占用了一行,设置transform
          let rightDis = (clientWidth-20) <= this.$refs['action-item'].$el.clientWidth ? (clientWidth - max*width) : 0
          this.shrinkageBtnStyle = {
            'transform': `translateX(${-rightDis}px`,
          }
        }

      })
    }
  },
  destroyed() {
    window.addEventListener('resize', this.setShrinkage)
  },
  mounted() {
    this.setShrinkage()
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
    }
  }
}
</style>